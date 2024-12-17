import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  console.log("testing")
  const { messages } = await req.json();

  // return error 400

  return new Response("Bad Request", { status: 400 });


  console.log("Here with messages", messages);

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}
