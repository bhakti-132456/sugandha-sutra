"use client";

/**
 * VideoScrubRitual — The Burn
 * 
 * Apple-grade hardware-accelerated scroll-driven video experience.
 * Uses <canvas> rendering with requestVideoFrameCallback (RVFC)
 * for frame-accurate, jitter-free performance.
 */

import { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════
   SIDE CONTENT PHASES
   ═══════════════════════════════════════════════ */

const phases = [
    {
        id: "champa-jyoti",
        range: [0, 0.3],
        label: "01",
        title: "Champa Jyoti",
        subtitle: "A Bridge of Light",
        body: "From the sacred Champaca groves of Southern India, each stick carries the luminescence of a thousand temple flames. Hand-rolled under the waning moon using techniques preserved for twelve generations.",
        accent: "var(--accent-gold)",
        accentRaw: "hsla(38, 85%, 55%,",
        audioSrc: "/audio/Forest-Ambient-_1_.ogg",
    },
    {
        id: "ingredient-provenance",
        range: [0.3, 0.7],
        label: "02",
        title: "Ingredient Provenance",
        subtitle: "From Earth to Ether",
        body: "Wild-harvested Mysore sandalwood. Organic rose attar from Kannauj. Vetiver roots from the banks of the Kaveri. Every ingredient ethically sourced, sun-dried, and ground by hand in granite mortars.",
        accent: "var(--accent-green)",
        accentRaw: "hsla(165, 55%, 45%,",
        audioSrc: "/audio/Forest-Ambient-_2_.ogg",
    },
    {
        id: "computational-healing",
        range: [0.7, 1.0],
        label: "03",
        title: "Computational Healing",
        subtitle: "Ancient Science × Algorithm",
        body: "Each blend is tuned to Solfeggio frequencies through our Resonance Mapping Engine. The molecular structure of every aromatic compound is harmonized to 528Hz — the Love Frequency.",
        accent: "var(--accent-violet)",
        accentRaw: "hsla(270, 45%, 60%,",
        audioSrc: "/audio/Forest-Ambient-_3_.ogg",
    },
];

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function VideoScrubRitual() {
    const router = useRouter();
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const rafRef = useRef(null);

    // Smooth Scrub Persistence
    const virtualPlayhead = useRef(0);
    const smoothPlayhead = useRef(0); // For interpolation
    const lastPaintedTime = useRef(-1);
    const isSeeking = useRef(false);

    // Audio Integration
    const audioRefs = useRef([]);
    const [isMuted, setIsMuted] = useState(true);

    const [activePhase, setActivePhase] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [videoReady, setVideoReady] = useState(false);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // ── High-Performance Render Loop ──
    const renderFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = contextRef.current;

        if (!video || !canvas || !ctx || !video.duration) return;

        // 1. Interpolate playhead for buttery smoothness
        // We use a simple lerp to follow the scroll progress smoothly
        const lerpFactor = 0.1;
        smoothPlayhead.current += (virtualPlayhead.current - smoothPlayhead.current) * lerpFactor;

        const targetTime = smoothPlayhead.current * video.duration;

        // 2. Performance Guard: Only seek if not already seeking
        // and if the time difference is significant enough (e.g. > 1/120s)
        const timeDiff = Math.abs(targetTime - video.currentTime);

        if (!video.seeking && timeDiff > 0.008) {
            // Use fastSeek if available (Safari/Firefox) for lower latency
            if (video.fastSeek) {
                video.fastSeek(targetTime);
            } else {
                video.currentTime = targetTime;
            }
        }

        // 3. Paint logic: Only draw if the frame has actually changed
        // This saves GPU cycles if we're between video frames
        if (Math.abs(video.currentTime - lastPaintedTime.current) > 0.001) {
            const vWidth = video.videoWidth;
            const vHeight = video.videoHeight;
            const cWidth = canvas.width;
            const cHeight = canvas.height;

            if (vWidth && vHeight) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const vRatio = vWidth / vHeight;
                const cRatio = cWidth / cHeight;

                let dWidth, dHeight, dx, dy;
                if (cRatio > vRatio) {
                    dWidth = cWidth;
                    dHeight = cWidth / vRatio;
                    dx = 0;
                    dy = (cHeight - dHeight) / 2;
                } else {
                    dHeight = cHeight;
                    dWidth = cHeight * vRatio;
                    dx = (cWidth - dWidth) / 2;
                    dy = 0;
                }

                ctx.drawImage(video, dx, dy, dWidth, dHeight);
                lastPaintedTime.current = video.currentTime;
            }
        }

        rafRef.current = requestAnimationFrame(renderFrame);
    };

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!video || !canvas || !section) return;

        contextRef.current = canvas.getContext("2d", { alpha: false });

        // High-DPI Canvas Setup
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            // We do NOT use ctx.scale here because we calculate 
            // exact physical pixel positions in the render loop 
            // to ensure perfect 'cover' behavior on all displays.
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        let trigger;

        const initScrollTrigger = () => {
            setVideoReady(true);

            trigger = ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                // scrub: 1.2 creates a weighted physical feel
                scrub: 1.2,
                onUpdate: (self) => {
                    const p = self.progress;
                    virtualPlayhead.current = p;
                    setScrollProgress(p);

                    // Sync UI Phase
                    let currentPhaseIndex = 0;
                    for (let i = phases.length - 1; i >= 0; i--) {
                        if (p >= phases[i].range[0]) {
                            currentPhaseIndex = i;
                            break;
                        }
                    }
                    setActivePhase(currentPhaseIndex);

                    // Sync Audio Crossfade
                    if (!isMuted) {
                        phases.forEach((phase, index) => {
                            const audio = audioRefs.current[index];
                            if (!audio) return;
                            const phaseCenter = (phase.range[0] + phase.range[1]) / 2;
                            const phaseWidth = phase.range[1] - phase.range[0];
                            const dist = Math.abs(p - phaseCenter);
                            let vol = 1 - (dist / (phaseWidth * 0.8));
                            audio.volume = Math.max(0, Math.min(1, vol));
                        });
                    }
                },
            });

            // Start Render Loop
            // Use RVFC if available for frame-exact clocking
            if ('requestVideoFrameCallback' in video) {
                const updateOnFrame = () => {
                    renderFrame();
                    video.requestVideoFrameCallback(updateOnFrame);
                };
                video.requestVideoFrameCallback(updateOnFrame);
            } else {
                rafRef.current = requestAnimationFrame(renderFrame);
            }
        };

        if (video.readyState >= 1) {
            initScrollTrigger();
        } else {
            video.addEventListener("loadedmetadata", initScrollTrigger, { once: true });
        }

        return () => {
            if (trigger) trigger.kill();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resizeCanvas);
            video.removeEventListener("loadedmetadata", initScrollTrigger);
        };
    }, [isMuted]);

    // Sync audio playback state
    useEffect(() => {
        audioRefs.current.forEach((audio) => {
            if (!audio) return;
            audio.muted = isMuted;
            if (!isMuted) {
                audio.play().catch(() => { });
            } else {
                audio.pause();
            }
        });
    }, [isMuted]);

    const phase = phases[activePhase];

    return (
        <section
            ref={sectionRef}
            id="video-scrub-ritual"
            style={{
                position: "relative",
                zIndex: 0,
                height: "500vh",
                background: "var(--bg-void)",
            }}
        >
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                {/* ── Source Video (Hidden) ── */}
                <video
                    ref={videoRef}
                    src="/incense.mp4"
                    muted
                    playsInline
                    preload="auto"
                    style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                />

                {/* ── Accelerated Canvas Layer ── */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        willChange: "transform",
                        display: "block",
                    }}
                />

                {/* ── Cinematic Global Vignette ── */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 2,
                        background: `radial-gradient(circle at 50% 50%, transparent 20%, hsla(0,0%,3%,0.6) 100%)`,
                        pointerEvents: "none",
                    }}
                />

                {/* ── Mobile-Specific Gradient Overlay ── */}
                <div
                    className="mobile-overlay"
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 3,
                        background: "linear-gradient(to top, var(--bg-void) 0%, transparent 60%, var(--bg-void) 100%)",
                        pointerEvents: "none",
                        opacity: 0,
                    }}
                />

                {/* ── Left Narrative Panel ── */}
                <div className="narrative-panel">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePhase}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.5rem",
                                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                                pointerEvents: "auto",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <span style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: phase.accent,
                                    boxShadow: `0 0 10px ${phase.accent}`
                                }}></span>
                                <span style={{
                                    fontSize: "0.7rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.2em",
                                    color: phase.accent,
                                    fontFamily: "var(--font-mono)",
                                }}>
                                    Phase {phase.label}
                                </span>
                            </div>

                            <h3 style={{
                                fontSize: "clamp(2rem, 3vw, 2.8rem)",
                                fontFamily: "var(--font-heading)",
                                fontWeight: 300,
                                color: "var(--text-primary)",
                                lineHeight: 1.1,
                            }}>
                                {phase.title}
                            </h3>
                            <p style={{
                                fontSize: "1rem",
                                color: "var(--text-secondary)",
                                fontStyle: "italic",
                                opacity: 0.8
                            }}>
                                {phase.subtitle}
                            </p>
                            <p style={{
                                fontSize: "1rem",
                                lineHeight: "1.7",
                                color: "var(--text-secondary)",
                                borderLeft: `2px solid ${phase.accent}`,
                                paddingLeft: "1.25rem",
                                background: "linear-gradient(90deg, rgba(0,0,0,0.2), transparent)",
                            }}>
                                {phase.body}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Right Interaction Panel ── */}
                <div className="interaction-panel">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <button
                            onClick={toggleMute}
                            aria-label={isMuted ? "Unmute Ritual" : "Mute Ritual"}
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.05)",
                                border: `1px solid ${isMuted ? 'rgba(255,255,255,0.1)' : phase.accent}`,
                                color: isMuted ? "var(--text-muted)" : phase.accent,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {isMuted ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                                    <line x1="23" y1="9" x2="17" y2="15" />
                                    <line x1="17" y1="9" x2="23" y2="15" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2V15H6L11 19V5Z" />
                                    <path d="M15.54 8.46C16.47 9.4 17 10.7 17 12C17 13.3 16.47 14.6 15.54 15.54" />
                                </svg>
                            )}
                        </button>

                        <div style={{ flex: 1, display: "flex", gap: "3px", height: "20px", alignItems: "center" }}>
                            {[...Array(16)].map((_, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    background: isMuted ? "rgba(255,255,255,0.1)" : phase.accent,
                                    height: isMuted ? "2px" : `${Math.random() * 80 + 20}%`,
                                    borderRadius: "1px",
                                    animation: isMuted ? "none" : `pulse-bar 0.5s infinite alternate ${i * 0.08}s`
                                }} />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const mapping = {
                                "champa-jyoti": "/ritual/champa-jyoti",
                                "ingredient-provenance": "/ritual/sacred-sandalwood",
                                "computational-healing": "/ritual/temple-rose",
                            };
                            const path = mapping[phase.id] || "/sanctuary";
                            router.push(path);
                        }}
                        style={{
                            width: "100%",
                            padding: "0.85rem",
                            background: phase.accent,
                            border: "none",
                            borderRadius: "12px",
                            color: "#000",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            boxShadow: `0 0 15px -4px ${phase.accent}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <span>Enter Ritual</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                        </svg>
                    </button>
                </div>

                <style jsx>{`
                    .narrative-panel {
                        position: absolute;
                        top: 50%;
                        left: 5%;
                        transform: translateY(-50%);
                        z-index: 10;
                        width: 35%;
                        max-width: 420px;
                        pointer-events: none;
                    }

                    .interaction-panel {
                        position: absolute;
                        top: 50%;
                        right: 5%;
                        transform: translateY(-50%);
                        z-index: 10;
                        width: 300px;
                        background: rgba(10, 10, 12, 0.4);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 20px;
                        padding: 1.5rem;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                        display: flex;
                        flex-direction: column;
                        gap: 1.25rem;
                    }

                    @keyframes pulse-bar {
                        0% { height: 20%; }
                        100% { height: 100%; }
                    }

                    @media (max-width: 768px) {
                        .mobile-overlay {
                            opacity: 1 !important;
                        }

                        .narrative-panel {
                            width: 90%;
                            left: 50%;
                            top: 40%;
                            transform: translate(-50%, -50%);
                            max-width: none;
                            text-align: center;
                        }

                        .narrative-panel :global(p) {
                            border-left: none !important;
                            padding-left: 0 !important;
                            background: none !important;
                        }

                        .interaction-panel {
                            width: 90%;
                            right: 50%;
                            top: auto;
                            bottom: 120px;
                            transform: translateX(50%);
                            background: rgba(10, 10, 12, 0.6);
                        }
                    }
                `}</style>

                {/* ── Scroll Progress Arc ── */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "2.5rem",
                        left: "clamp(2.5rem, 6vw, 7rem)",
                        zIndex: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="18" cy="18" r="15" fill="none" stroke="hsla(0,0%,100%,0.06)" strokeWidth="1.5" />
                        <circle
                            cx="18" cy="18" r="15"
                            fill="none"
                            stroke={phase?.accent || "var(--accent-gold)"}
                            strokeWidth="1.5"
                            strokeDasharray={`${scrollProgress * 94.25} 94.25`}
                            strokeLinecap="round"
                            style={{ transition: "stroke 0.6s ease" }}
                        />
                    </svg>
                    <span style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                    }}>
                        {Math.round(scrollProgress * 100)}%
                    </span>
                </div>

                {/* ── Scroll Hint ── */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "2.5rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 5,
                        textAlign: "center",
                        opacity: scrollProgress < 0.02 && videoReady ? 1 : 0,
                        transition: "opacity 1s ease",
                        pointerEvents: "none",
                    }}
                >
                    <p style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        marginBottom: "0.75rem",
                        fontFamily: "var(--font-mono)",
                    }}>
                        Scroll to Begin the Burn
                    </p>
                    <div style={{
                        width: "1px",
                        height: "36px",
                        background: "linear-gradient(to bottom, var(--accent-gold), transparent)",
                        margin: "0 auto",
                    }} />
                </div>

                {/* ── Ambient Glow ── */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        right: "-5%",
                        width: "40vw",
                        height: "40vw",
                        borderRadius: "50%",
                        background: `radial-gradient(ellipse, ${phase?.accentRaw || "hsla(38, 85%, 55%,"} 0.06) 0%, transparent 70%)`,
                        filter: "blur(80px)",
                        zIndex: 1,
                        pointerEvents: "none",
                        transition: "background 1.5s ease",
                    }}
                />

                {/* Hidden Audio Elements */}
                <div style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}>
                    {phases.map((p, i) => (
                        <audio
                            key={p.id}
                            ref={(el) => (audioRefs.current[i] = el)}
                            src={p.audioSrc}
                            loop
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
