"use client";
import React from "react";
import { TimeLeft } from "../hooks/useCountdown";

export default function Countdown({ timeLeft }: { timeLeft: TimeLeft }) {
  return (
    <div className="flex gap-4 mb-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <span className="block text-3xl font-bold text-green-400">{value}</span>
          <span className="block text-xs text-gray-500 uppercase">{unit}</span>
        </div>
      ))}
    </div>
  );
}
