// src/hooks/useSiteWebSocket.ts
import { useEffect, useRef, useState } from "react";

export  interface SiteMessage {
  message?: string;
  error?: string;
  sitecode?: string;
  update?: {
    liveCalls?: Record<string, CallData>; // or CallData[], depending on backend
  };
}


// Backend shape
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
}

export function useSiteWebSocket(username: string, sitecode: string):UseSiteWebSocketResult {
  
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<SiteMessage[]>([]);

  useEffect(() => {
    if (!username || !sitecode) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname;
    const port = 3000; // backend port
    const ws = new WebSocket(`${protocol}://${host}:${port}/ws`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ action: 'subscribe', username, sitecode }));
    };

  ws.onmessage = (event) => {
  try {
    const parsed = JSON.parse(event.data) as SiteMessage;
    setMessages((prev) => [...prev, parsed]);
  } catch (e) {
    console.error("Invalid WS message", e);
  }
};
    ws.onerror = (err) => console.error('WebSocket error', err);
    ws.onclose = () => console.log('WebSocket disconnected');

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'unsubscribe', username, sitecode }));
      }
      ws.close();
    };
  }, [username, sitecode]);

  return { messages };
}
