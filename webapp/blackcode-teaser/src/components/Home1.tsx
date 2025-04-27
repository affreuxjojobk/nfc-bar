"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useCountdown from "../hooks/useCountdown";
import styles from "../styles/Home.module.css"; // Importation des styles locaux

const hackLines = [
  "[Initializing BlackCode sequence...]",
  "[Decrypting mission parameters...]",
  "[Establishing secure channel...]",
  "[Access level: SECRET OPS]",
  "[Countdown protocol initiated...]",
];

const logFeed = Array.from({ length: 200 }, (_, i) => hackLines[i % hackLines.length]);

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();
  const { jours, heures, minutes, secondes } = useCountdown("2025-09-06T00:00:00");

  const [showFlyer, setShowFlyer] = useState(false);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});

    // Le hacklog dure environ 10 secondes, après on affiche le flyer
    const timer = setTimeout(() => {
      setShowFlyer(true);
    }, 10000); // durée à adapter selon vitesse de scroll

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src="/blackcode/ambiance.mp3" loop preload="auto" />

      <h1 className={styles.glitch} data-text="BLACKCODE">
        BLACKCODE
      </h1>

      {/* Countdown */}
      <div className={styles.countdown}>
        <span>{String(jours).padStart(2, "0")}</span>:
        <span>{String(heures).padStart(2, "0")}</span>:
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(secondes).padStart(2, "0")}</span>
      </div>

      {/* Hacklog qui défile */}
      {!showFlyer && (
		  <div className={styles.hackLogContainer}>
			<div className={styles.hackLogContent}>
			  {logFeed.map((line, i) => (
				<div key={i} className={styles.hackLine}>
				  {line}
				</div>
			  ))}
			</div>
		  </div>
		)}

      {/* Flyer */}
      {showFlyer && (
        <div className={styles.flyerContainer}>
          <div>
            <p className={styles.welcomeMessage}>Prêt à démarrer ?</p>
            <img
              src="/blackcode/flyer_blackcode1.jpg"
              alt="Flyer Blackcode"
              className={styles.flyer}
            />
            <button onClick={() => router.push("/mission")} className={styles.button}>
              ACCÉDER À LA MISSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
