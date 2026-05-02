import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export default function CountdownTimer({ endsAt }) {
  const calc = () => {
    const diff = new Date(endsAt) - new Date();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (!time) return null;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium"
      style={{ color: "#f87171" }}>
      <Timer size={12} />
      <span>Sale ends in</span>
      <span className="font-mono">{pad(time.h)}:{pad(time.m)}:{pad(time.s)}</span>
    </div>
  );
}
