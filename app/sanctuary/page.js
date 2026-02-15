"use client";

/**
 * Sugandha Sutra — The Sanctuary
 * The immersive portal that loads after the CTA activation.
 * Full-screen SensoryEngine with sacred geometry + generative audio.
 */

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import of SensoryEngine — heavy Three.js/Tone.js bundle
const SensoryEngine = dynamic(() => import("@/components/SensoryEngine"), {
    ssr: false,
    loading: () => (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "var(--bg-void)",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                    textAlign: "center",
                    color: "var(--text-secondary)",
                }}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        fontSize: "2rem",
                        marginBottom: "1rem",
                        color: "var(--accent-gold)",
                    }}
                >
                    ◯
                </motion.div>
                <p
                    style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                    }}
                >
                    Preparing Your Sanctuary
                </p>
            </motion.div>
        </div>
    ),
});

export default function SanctuaryPage() {
    const [isReady, setIsReady] = useState(false);

    return (
        <main
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "var(--bg-void)",
            }}
        >
            {/* Navigation back */}
            <motion.a
                href="/"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                style={{
                    position: "fixed",
                    top: "2rem",
                    left: "2rem",
                    zIndex: 50,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "0.5rem 1rem",
                    background: "var(--bg-glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "100px",
                    transition: "all 0.4s ease",
                }}
                aria-label="Return to the landing page"
                id="nav-back-home"
            >
                ← Return
            </motion.a>

            {/* SensoryEngine — full-screen immersive */}
            <SensoryEngine sku="champa-jyoti" onReady={() => setIsReady(true)} />

            {/* Sacred text overlay when ready */}
            <AnimatePresence>
                {isReady && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: "absolute",
                            bottom: "15%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            textAlign: "center",
                            zIndex: 10,
                            pointerEvents: "none",
                            maxWidth: "500px",
                            padding: "0 2rem",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "0.7rem",
                                letterSpacing: "0.35em",
                                textTransform: "uppercase",
                                color: "var(--accent-gold)",
                                marginBottom: "0.75rem",
                            }}
                        >
                            You are now within the sanctuary
                        </p>
                        <p
                            style={{
                                fontSize: "var(--font-size-body)",
                                color: "var(--text-secondary)",
                                lineHeight: 1.8,
                            }}
                        >
                            Breathe. The Flower of Life pulses with you. The 528Hz frequency
                            is recalibrating your inner architecture.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
