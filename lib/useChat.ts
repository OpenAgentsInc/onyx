import { useCallback, useEffect, useRef } from "react"
import EventSource from "react-native-sse"
import { useAuth } from "@clerk/clerk-expo"
import { useBaseChat } from "@qms/shared"

import type {
  UseChatOptions,
  UseChatReturn,
  TextDeltaEvent,
  ToolCallEvent,
  ToolResultEvent,
  StepFinishEvent,
  FinishEvent,
  Message,
} from "@qms/shared";

type CustomEvents =
  | TextDeltaEvent["type"]
  | ToolCallEvent["type"]
  | ToolResultEvent["type"]
  | StepFinishEvent["type"]
  | FinishEvent["type"];

export const useChat = ({
  maxToolRoundtrips = 6,
  initialInput = "",
  initialMessages = [],
  onFinish,
}: UseChatOptions): UseChatReturn => {
  const { getToken } = useAuth();
  const eventSourceRef = useRef<EventSource | null>(null);

  const {
    messages,
    input,
    currentAssistantMessageRef,
    roundtripCountRef,
    isLoading,
    setMessages,
    updateMessage,
    setIsLoading,
    setInput,
    handleInputChange,
    handleTextDeltaEvent,
    handleToolCallEvent,
    handleToolResultEvent,
  } = useBaseChat({ initialInput, initialMessages });

  const sendChatRequest = useCallback(
    async (
      chatMessages: Message[],
      roundtripCount: number,
      body: { threadId: string; locale: string; replyMessage?: string }
    ) => {
      const token = await getToken();
      try {
        const eventSource = new EventSource<CustomEvents>(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/chat`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "text/event-stream",
              Authorization: `Bearer ${token}`,
            },
            method: "POST",
            pollingInterval: 0,
            withCredentials: true,
            body: JSON.stringify({
              messages: chatMessages,
              ...body,
            }),
          }
        );

        eventSourceRef.current = eventSource;

        currentAssistantMessageRef.current = {
          id: generateUniqueId(),
          role: "assistant",
          content: "",
          isFinished: false,
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...currentAssistantMessageRef.current,
          },
        ]);

        eventSource.addEventListener("text-delta", (event) => {
          if (event.data === null) return;
          const data = JSON.parse(event.data) as TextDeltaEvent;
          handleTextDeltaEvent(data);
        });

        eventSource.addEventListener("tool-call", (event) => {
          const data = JSON.parse(event.data as string) as ToolCallEvent;
          handleToolCallEvent(data);
        });

        eventSource.addEventListener("tool-result", (event) => {
          const data = JSON.parse(event.data as string) as ToolResultEvent;
          handleToolResultEvent(data);
        });

        const handleFinish = (data: StepFinishEvent | FinishEvent) => {
          if (data.type === "finish") {
            const oldMessageId = currentAssistantMessageRef.current.id;
            const newMessage = {
              ...currentAssistantMessageRef.current,
              id: data.messageId,
              isFinished: true,
            };
            updateMessage(oldMessageId, newMessage);
          }

          if (
            data.finishReason === "tool-calls" &&
            roundtripCount < maxToolRoundtrips
          ) {
            eventSource.close();
            sendChatRequest(
              [
                ...chatMessages,
                {
                  ...currentAssistantMessageRef.current,
                },
              ],
              roundtripCount + 1,
              body
            );
          } else {
            setIsLoading(false);
            if (onFinish) onFinish();
            eventSource.close();
          }
        };

        eventSource.addEventListener("step-finish", (event) => {
          if (event.data === null) return;
          handleFinish(JSON.parse(event.data) as StepFinishEvent);
        });

        eventSource.addEventListener("finish", (event) => {
          if (event.data === null) return;
          handleFinish(JSON.parse(event.data) as FinishEvent);
        });

        eventSource.addEventListener("error", (event) => {
          console.error("EventSource error");
          setIsLoading(false);
          eventSource.close();
        });
      } catch (error) {
        console.error("Send Message Error:", error);
        setIsLoading(false);
      }
    },
    [
      getToken,
      currentAssistantMessageRef,
      setMessages,
      handleTextDeltaEvent,
      handleToolCallEvent,
      handleToolResultEvent,
      maxToolRoundtrips,
      updateMessage,
      setIsLoading,
      onFinish,
    ]
  );

  const handleSubmit = useCallback(
    async (body: {
      threadId: string;
      locale: string;
      replyMessage?: string;
    }) => {
      if (input.trim() === "") return;

      const userMessage: Message = {
        id: generateUniqueId(),
        role: "user",
        content: input.trim(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      roundtripCountRef.current = 0;
      await sendChatRequest(newMessages, roundtripCountRef.current, body);
    },
    [
      input,
      messages,
      setMessages,
      setInput,
      setIsLoading,
      roundtripCountRef,
      sendChatRequest,
    ]
  );

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
};

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 9);
};
