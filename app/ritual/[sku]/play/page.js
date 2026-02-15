"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import { getRitualBySku } from "@/lib/ritualData";

export default function RitualPlayPage() {
    const params = useParams();
    const router = useRouter();
    const sku = params?.sku || "champa-jyoti";
    const ritual = useMemo(() => getRitualBySku(sku), [sku]);

    // Scroll Physics for Mandala
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    // Map scroll speed to rotation speed
    const rotation = useTransform(smoothVelocity, [0, 1000], [0, 360], { clamp: false });

    // Audio State
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        // Auto-play ambient audio on mount (subject to browser policy)
        if (audioRef.current) {
            audioRef.current.volume = volume;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };

    return (
        <main
            style={{
                position: "relative",
                minHeight: "200vh", // Tall enough to scroll
                background: "var(--bg-void)",
                overflow: "hidden",
                color: "var(--text-primary)",
            }}
        >
            {/* Navigation / Exit */}
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pointerEvents: "none", // Let clicks pass through to potential interactive elements
                }}
            >
                <button
                    onClick={() => router.back()}
                    style={{
                        pointerEvents: "auto",
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "var(--text-secondary)",
                        padding: "0.5rem 1rem",
                        borderRadius: "100px",
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        letterSpacing: "0.2em",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <span style={{ fontSize: "1rem" }}>×</span> End Ritual
                </button>
            </nav>

            {/* ── Fixed Center Content ── */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 0,
                }}
            >
                {/* 1. Mandala Layer */}
                <motion.div
                    style={{
                        position: "absolute",
                        width: "80vh",
                        height: "80vh",
                        rotate: rotation, // Spins based on scroll
                        opacity: 0.15,
                        filter: "blur(1px)",
                    }}
                >
                    {/* Simple Geometric Mandala SVG */}
                    <svg viewBox="0 0 100 100" fill="none" stroke={ritual.accentColor || "var(--accent-gold)"} strokeWidth="0.5">
                        <circle cx="50" cy="50" r="48" opacity="0.5" />
                        <circle cx="50" cy="50" r="38" opacity="0.3" />
                        <circle cx="50" cy="50" r="28" opacity="0.2" />
                        {[...Array(12)].map((_, i) => (
                            <path
                                key={i}
                                d="M50 50 L50 2"
                                transform={`rotate(${i * 30} 50 50)`}
                                opacity="0.4"
                            />
                        ))}
                        {[...Array(8)].map((_, i) => (
                            <rect
                                key={i}
                                x="45" y="5" width="10" height="10"
                                transform={`rotate(${i * 45} 50 50)`}
                                strokeWidth="0.2"
                                opacity="0.6"
                            />
                        ))}
                    </svg>
                </motion.div>

                {/* 2. Product Glow Layer */}
                <div
                    style={{
                        position: "absolute",
                        width: "40vw",
                        height: "40vw",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${ritual.accentColor || "var(--accent-gold)"} 0%, transparent 70%)`,
                        opacity: 0.15,
                        filter: "blur(80px)",
                        zIndex: -1,
                    }}
                />

                {/* 3. Central Title/Focus */}
                <div style={{ textAlign: "center", zIndex: 10 }}>
                    <h1
                        style={{
                            fontSize: "clamp(2rem, 5vw, 4rem)",
                            fontFamily: "var(--font-heading)",
                            fontWeight: 300,
                            color: "var(--text-primary)",
                            textShadow: "0 0 30px rgba(0,0,0,0.5)",
                            marginBottom: "1rem",
                        }}
                    >
                        {ritual.name}
                    </h1>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: ritual.accentColor || "var(--accent-gold)",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        {ritual.frequency}Hz Frequency
                    </p>

                    <p style={{
                        marginTop: "4rem",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        opacity: 0.6
                    }}>
                        Scroll to resonate the mandala
                    </p>
                </div>
            </div>

            {/* ── Audio Player (Floating Bottom) ── */}
            <div
                style={{
                    position: "fixed",
                    bottom: "3rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 40,
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    padding: "1rem 2rem",
                    background: "rgba(10, 10, 12, 0.6)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "100px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                }}
            >
                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    style={{
                        background: "none",
                        border: "none",
                        color: ritual.accentColor,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>

                {/* Track Info */}
                <div style={{ textAlign: "center", minWidth: "120px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-primary)" }}>{ritual.frequencyName}</div>
                    <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>Start the Ritual</div>
                </div>

                {/* Volume Slider */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            width: "80px",
                            accentColor: ritual.accentColor,
                            cursor: "pointer"
                        }}
                    />
                </div>
            </div>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={ritual.audioFile}
                loop
            />

            {/* Placeholder content to allow scrolling */}
            <div style={{ height: "300vh" }}></div>
        </main>
    );
}
