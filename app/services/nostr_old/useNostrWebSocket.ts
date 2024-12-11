import { useEffect, useState } from "react"
import { nostrWebSocketService } from "./NostrWebSocketService"

export const useNostrWebSocket = (url: string) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    nostrWebSocketService.connect(url)
      .then(() => setConnected(true))
      .catch((error) => console.error("Failed to connect:", error));

    return () => nostrWebSocketService.disconnect();
  }, [url]);

  const sendEvent = (event: any) => nostrWebSocketService.sendEvent(event);
  const subscribe = (subscriptionId: string, filters: any[]) =>
    nostrWebSocketService.subscribe(subscriptionId, filters);
  const unsubscribe = (subscriptionId: string) =>
    nostrWebSocketService.unsubscribe(subscriptionId);

  return { connected, sendEvent, subscribe, unsubscribe };
};
