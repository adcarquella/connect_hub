// src/components/SiteFeed.tsx
import React, { useState } from "react";
import { useSiteWebSocket } from "../hooks/useSiteWebSocket";

export const SiteFeed: React.FC = () => {
  const [username, setUsername] = useState<string>("alice");
  const [sitecode, setSitecode] = useState<string>("SITE123");

  const { messages } = useSiteWebSocket( username, sitecode );

  return (
    <div>
      <h2>Site Updates for {sitecode}</h2>
      <ul>
        {messages.map((msg: SiteMessage, i: number) => (
          <li key={i}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

interface SiteMessage {
  message?: string;
  error?: string;
  sitecode?: string;
  update?: string;
}