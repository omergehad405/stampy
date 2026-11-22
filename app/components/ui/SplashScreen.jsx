"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FALLBACK_MS = 7500; // max wait if video stalls

export default function SplashScreen() {
  const [show, setShow] = useState(true); // always start visible
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    // Skip for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }

    // Fallback: force-dismiss in case onEnded never fires
    timerRef.current = window.setTimeout(dismiss, FALLBACK_MS);
    return () => window.clearTimeout(timerRef.current);
  }, []);

  function dismiss() {
    window.clearTimeout(timerRef.current);
    setShow(false);
  }

  // On SSR / before mount: render a plain static div so the page appears blocked
  // (no framer-motion on server — avoids hydration mismatch)
  if (!mounted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          backgroundColor: "#F9F9F7",
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#F9F9F7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Logo motion video */}
          <video
            key="splash-video"
            src="/logo_motion.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={dismiss}
            onError={dismiss}
            style={{
              width: "min(70vw, 460px)",
              height: "auto",
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
              position: "relative",
              zIndex: 1,
            }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
