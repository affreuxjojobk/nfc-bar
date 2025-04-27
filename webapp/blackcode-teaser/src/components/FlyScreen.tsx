"use client";
import React from "react";

export default function FlyScreen() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-black/70 z-20" />
      <div
        className="absolute inset-0 bg-[url('/blackcode/flyer_blackcode1.jpg')] bg-cover bg-center opacity-20 z-10"
      />
    </div>
  );
}
