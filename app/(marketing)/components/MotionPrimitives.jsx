"use client";

import React from "react";
import { motion, MotionConfig } from "framer-motion";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1];

/**
 * Global MotionConfig wrapper for the marketing site so all animations
 * automatically respect the user's prefers-reduced-motion setting.
 */
export function MarketingMotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Immediate mount reveal for above-the-fold hero content.
 * Uses short durations so essential content is never delayed.
 */
export function MotionHeroItem({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll-triggered reveal for sections and headings.
 */
export function MotionReveal({
  children,
  delay = 0,
  y = 20,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container for grids, lists, and timelines.
 */
export function MotionStagger({
  children,
  className = "",
  staggerDelay = 0.07,
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.04,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item inside a MotionStagger container, with optional subtle hover lift.
 */
export function MotionStaggerItem({
  children,
  className = "",
  hoverLift = false,
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.42, ease: EASE_OUT_EXPO },
        },
      }}
      whileHover={hoverLift ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
