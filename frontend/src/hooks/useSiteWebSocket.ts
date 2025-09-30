// src/hooks/useSiteWebSocket.ts
import { useEffect, useRef, useState } from "react";

interface SiteMessage {
  message?: string;
  error?: string;
  sitecode?: string;
  update?: string;
}

export function useSiteWebSocket(username: string, sitecode: string) {
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
        const data: SiteMessage = JSON.parse(event.data);
        setMessages(prev => [...prev, data]);
      } catch (err) {
        console.error('Invalid message', event.data);
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
