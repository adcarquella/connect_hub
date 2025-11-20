import React, { useEffect, useState } from "react";

interface CallDurationProps {
  callStartTime: string | Date; // Accepts ISO string or Date object
}

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [
    hrs.toString().padStart(2, "0"),
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
};

const CallDuration: React.FC<CallDurationProps> = ({ callStartTime }) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const start = new Date(callStartTime).getTime();

    const update = () => {
      const now = Date.now();
      const diffSeconds = Math.max(0, Math.floor((now - start) / 1000));
      setElapsed(diffSeconds);
    };

    // Initial calculation
    update();

    // Only start ticker if the callStartTime is before now
    if (start <= Date.now()) {
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }
  }, [callStartTime]);

  return (
    <span className="text-lg font-semibold text-foreground">
      {formatTime(elapsed)}
    </span>
  );
};

export default CallDuration;
