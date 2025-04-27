// src/contexts/AudioContext.tsx
"use client";

import { createContext, useContext, useRef, useEffect } from "react";

type AudioContextType = {
  playAmbiance: () => void;
};

const AudioContext = createContext<AudioContextType>({
  playAmbiance: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef(new Audio("/blackcode/ambiance.mp3"));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0;
  }, []);

  const playAmbiance = () => {
    const audio = audioRef.current;
    audio.play();
    let vol = 0;
    const fade = setInterval(() => {
      if (vol < 1) {
        vol = Math.min(vol + 0.02, 1);
        audio.volume = vol;
      } else clearInterval(fade);
    }, 100);
  };

  return (
    <AudioContext.Provider value={{ playAmbiance }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAmbiance() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAmbiance must be used within AudioProvider");
  return ctx;
}
