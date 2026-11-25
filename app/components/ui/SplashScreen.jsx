"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FALLBACK_MS = 7500; // max wait if video stalls
const subscribeToMount = () => () => {};
const getClientMountState = () => true;
const getServerMountState = () => false;

function markSplashComplete() {
  document.documentElement.dataset.splashComplete = "true";
  window.dispatchEvent(new Event("notch:splash-complete"));
}

export default function SplashScreen() {
  const [show, setShow] = useState(true); // always start visible
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientMountState,
    getServerMountState
  );
  const timerRef = useRef(null);

  useEffect(() => {
    // Skip for users who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frameId = window.requestAnimationFrame(() => {
        markSplashComplete();
        setShow(false);
      });
      return () => window.cancelAnimationFrame(frameId);
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
        data-splash-screen
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
    <AnimatePresence onExitComplete={markSplashComplete}>
      {show && (
        <motion.div
          key="splash"
          data-splash-screen
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
            src="/notch_logo_animation.mp4"
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
