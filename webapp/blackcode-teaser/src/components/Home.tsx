"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useCountdown from "../hooks/useCountdown";
import styles from "../styles/Home.module.css";

const hackLines = [
  "[Initializing BlackCode sequence... bndjbfjfbjzfbebgfjhgtggh:dbf:jbfjfjfnbjndbgjdfnbkfjdnbgkfndbkndfbjfjbfjFQ]",
  "[Decrypting mission parameters... fzdjfnjkdfnkjhyrhyzngkjfnbljhbgfusjhbfsuh,hfhkjlhbjkdsfbnvgjnkjzrkgjkrgjnkrgnjz]",
  "[Establishing secure channel...]",
  "[Access level: SECRET OPS]",
  "[Countdown protocol initiated... fdizhfizhfilzhhyrhjvbnsdjkbvjbdsjkngggcgbvjd<sbjsdkvbjgfjzrhgjfjzfgjzrfhjrghjs]",
];

const logFeed = Array.from({ length: 1500 }, (_, i) => 
  hackLines[i % hackLines.length]
);

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false); // <-- Déclaré directement ici
  const { jours, heures, minutes, secondes } = useCountdown("2025-09-06T22:00:00");

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});
    const id = setTimeout(() => setShowWelcome(true), 2300); // Le hacklog dure 8 secondes
    return () => clearTimeout(id);
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };
  
  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/blackcode/ambiance.mp3" loop preload="auto" />
      
	  {/* Bouton mute/unmute */}
      <button onClick={toggleMute} className={styles.muteButton}>
        {isMuted ? "🔇" : "🔊"}
      </button>
	  
      <h1 className={styles.glitch} data-text="BLACKCODE">
        BLACKCODE
      </h1>

      {!showWelcome && (
        <>
          <div className={styles.countdown}>
            <span>{String(jours).padStart(2, "0")}</span>:
            <span>{String(heures).padStart(2, "0")}</span>:
            <span>{String(minutes).padStart(2, "0")}</span>:
            <span>{String(secondes).padStart(2, "0")}</span>
          </div>

          <div className={styles.hackLogContent}>
            <div className={styles.hackLogInner}>
              {logFeed.map((line, i) => (
                <div key={i} className={styles.hackLine}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showWelcome && (
        <div className={styles.welcome}>
          <p className={styles.ready}>Prêt à démarrer la mission ?</p>
          <img
            src="/blackcode/flyer_blackcode1.jpg"
            alt="Flyer Blackcode"
            className={styles.flyer}
          />
          <button onClick={() => router.push("/mission")} className={styles.button}>
            ACCÉDER À LA MISSION
          </button>
        </div>
      )}
    </div>
  );
}
