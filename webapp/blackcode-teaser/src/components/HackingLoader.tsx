"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HackingLoader() {
  const fakeLogs = [
    "Connexion sécurisée établie...",
    "Injection du payload...",
    "Bypass du pare-feu...",
    "Exfiltration des données...",
    "Encryption des logs...",
    "Nettoyage des traces...",
    "Mission prête au lancement...",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-green-400 font-mono text-sm p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        {fakeLogs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.3 }}
          >
            {log}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
