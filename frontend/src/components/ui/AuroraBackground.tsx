import { motion } from "framer-motion";
import React from "react";

export const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/* Base Noise/Texture (Optional) */}
      <div className="absolute inset-0 opacity-20 contrast-120 brightness-100" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />

      {/* Animated Blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-violet-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30"
      />

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-cyan-600 rounded-full mix-blend-screen filter blur-[140px] opacity-30"
      />
    </div>
  );
};
