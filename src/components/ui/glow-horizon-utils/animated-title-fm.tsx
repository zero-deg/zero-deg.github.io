"use client";

import { motion } from "motion/react";

interface AnimatedTitleFMProps {
  open?: boolean;
}

export function AnimatedTitleFM({ open = true }: AnimatedTitleFMProps) {
  const mainTitle = "ZERO°";
  const subtitle = "PERSONAL INTELLIGENCE. EVERYWHERE.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      className="flex flex-col items-center justify-center text-center gap-6 px-6 pointer-events-none select-none z-20"
    >
      <motion.div variants={itemVariants} className="overflow-hidden">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white font-serif not-italic uppercase">
          {mainTitle}
        </h1>
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-white/60 tracking-[0.25em] text-[10px] md:text-xs uppercase font-mono max-w-md">
          {subtitle}
        </p>
      </motion.div>
    </motion.div>
  );
}
