"use client";
import React, { useEffect, useState } from "react";

const lines = [
  "Initialisation...",
  "Décodage en cours...",
  "Accès aux données accordé.",
];

export default function MissionConsole() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx < lines.length) {
      const t = setTimeout(() => setIdx(idx + 1), 1000);
      return () => clearTimeout(t);
    }
  }, [idx]);

  return (
    <pre className="font-mono text-green-400 bg-black border border-green-500 p-4 rounded-lg shadow-lg mb-6">
      {lines.slice(0, idx).map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </pre>
  );
}
