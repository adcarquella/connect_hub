// src/hooks/useSiteWebSocket.ts
import { useEffect, useRef, useState } from "react";

export interface SiteMessage {
  message?: string;
  error?: string;
  sitecode?: string;
  update?: {
    liveCalls?: Record<string, CallData>;
    senseEvents?: Record<string, DeviceStatus>;
  };
}

export type DeviceStatus = {
  zone?: string;
  status?: string;
  room?: string;
  description: Date;
  lightLevel?: number;
  presenceStart?: number;
};

export type CallData = {
  AccessoryType: string;
  aqRef: string;
  batteryLevel: string;
  beaconId: string;
  callType: string;
  carer: string;
  duration: string;
  end: string;
  journeyRef: string;
  locTx: string;
  panelRef: string;
  room: string;
  start: string;
  startFullDate: string;
  txCode: string;
  unitId: string;
  zone: string;
};

interface UseSiteWebSocketResult {
  messages: SiteMessage[];
  connected: boolean;
  retries: number;
}

export function useSiteWebSocket(username: string, sitecode: string): UseSiteWebSocketResult {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<SiteMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [retries, setRetries] = useState(0);
  const maxRetries = 5;
  const retryDelay = 2000; // ms

  useEffect(() => {
    if (!username || !sitecode) return;

    let shouldReconnect = true;

    const connect = (attempt = 0) => {
      if (attempt > maxRetries) {
        console.error(`WebSocket failed to connect after ${maxRetries} attempts.`);
        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const host = window.location.hostname;
      const port = 3000;
//      const wsUrl = `${protocol}://${host}:${port}/ws`;
      const wsUrl = "ws://connectapi.arquella.co.uk/ws";
      
      console.log(`Attempting WebSocket connection (try ${attempt + 1}/${maxRetries})...`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
        setRetries(attempt);
        ws.send(JSON.stringify({ action: "subscribe", username, sitecode }));
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as SiteMessage;
          setMessages((prev) => [...prev, parsed]);
        } catch (e) {
          console.error("Invalid WS message", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
      };

      ws.onclose = () => {
        console.warn("WebSocket disconnected");
        setConnected(false);

        if (shouldReconnect && attempt < maxRetries) {
          console.log(`Retrying connection in ${retryDelay / 1000}s...`);
          setTimeout(() => {
            setRetries(attempt + 1);
            connect(attempt + 1);
          }, retryDelay);
        }
      };
    };

    connect(0);

    return () => {
      shouldReconnect = false;
      if (wsRef.current) {
        try {
          wsRef.current.send(JSON.stringify({ action: "unsubscribe", username, sitecode }));
          wsRef.current.close();
        } catch (e) {
          console.warn("Error closing WebSocket:", e);
        }
      }
    };
  }, [username, sitecode]);

  return { messages, connected, retries };
}
