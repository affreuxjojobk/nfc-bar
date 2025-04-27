"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "../../styles/Home.module.css";

export default function MissionPage() {
  return (
    <div className={styles.container}>
      {/* Titre */}
      <h1 className="text-5xl font-bold text-center text-white mt-10">
        Mission 001: Opération BlackCode
      </h1>

      {/* Vidéo */}
      <motion.video
        src="/blackcode/clip.mp4"
        controls
        autoPlay
        muted
        className="mt-6 w-full max-w-md h-[50vh] mx-auto rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Bouton des préventes */}
      <motion.a
        href="https://www.bizouk.com/events/details/bk-n79-je-suis-retro/92420"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg text-lg tracking-wide relative overflow-hidden"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 10px #ff0000",
            "0 0 20px #ff0000",
            "0 0 10px #ff0000",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
        whileHover={{ scale: 1.1, backgroundColor: "#ff1a1a" }}
        whileTap={{ scale: 0.95 }}
      >
        PRÉVENTES & PACKS <ArrowRight size={20} />
      </motion.a>
    </div>
  );
}
