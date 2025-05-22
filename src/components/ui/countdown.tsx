import { useEffect, useState } from "react";

type CountdownProps = {
  timestamp: number;
  onExpiry: () => void;
};

type RemainingTime = {
  seconds: string;
  minutes: string;
  hours: string;
};

export default function Countdown({ timestamp, onExpiry }: CountdownProps) {
  const padNumber = (num: number) => String(num).padStart(2, "0");
  const calcuateRemainingTime = (
    timestampUnix: number,
  ): RemainingTime | null => {
    const remaining = timestampUnix - Date.now();

    if (remaining <= 0) return null;

    const seconds = Math.floor((remaining / 1000) % 60);
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const hours = Math.floor(remaining / 1000 / 60 / 60);

    return {
      seconds: padNumber(seconds),
      minutes: padNumber(minutes),
      hours: padNumber(hours),
    };
  };

  const [timeRemaining, setTimeRemaining] = useState(
    calcuateRemainingTime(timestamp),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = calcuateRemainingTime(timestamp);
      if (!updated) {
        clearInterval(interval);
      }

      setTimeRemaining(updated);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [timestamp]);

  useEffect(() => {
    if (!timeRemaining) {
      onExpiry();
    }
  }, [timeRemaining]);

  if (!timeRemaining) {
    return <span>expired</span>;
  }

  return (
    <span>
      {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}
    </span>
  );
}
