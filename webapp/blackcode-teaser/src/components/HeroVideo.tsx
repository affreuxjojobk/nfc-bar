"use client";
import React from "react";

type HeroVideoProps = { onEnd: () => void };

export default function HeroVideo({ onEnd }: HeroVideoProps) {
  return (
    <video
      className="absolute inset-0 object-cover opacity-50 z-10"
      src="/blackcode/clip.mp4"
      autoPlay
      muted
      onEnded={onEnd}
      playsInline
    />
  );
}
