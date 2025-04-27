import { useState, useEffect } from "react";

export type TimeLeft = { jours: number; heures: number; minutes: number; secondes: number };

export default function useCountdown(target: string): TimeLeft {
  const calc = (): TimeLeft => {
    const diff = Math.max(new Date(target).getTime() - Date.now(), 0);
    return {
      jours: Math.floor(diff / 86400000),
      heures: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      secondes: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}
