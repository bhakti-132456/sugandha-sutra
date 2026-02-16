"use client";

/**
 * Sugandha Sutra — SensoryEngine
 * The immersive Three.js + Tone.js experience.
 * Renders sacred geometry with audio-visual sync.
 *
 * Audio ONLY starts on user gesture (click on CTA).
 */

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CelestialScene } from "./CelestialMandala";
import { startSacredTone, getAmplitude, SOLFEGGIO_MAP } from "@/lib/audio";
import { getRitualBySku } from "@/lib/ritualData";

function SensoryScene({ audioActive, sku }) {
    const [intensity, setIntensity] = useState(0.5);
    const rafRef = useRef();

    // Determine frequency from SKU
    const solfeggioConfig = SOLFEGGIO_MAP[sku] || SOLFEGGIO_MAP.default;

    // Determine glow color based on SKU
    const glowColorMap = {
        "champa-jyoti": [0.886, 0.651, 0.196],     // Gold
        "sacred-sandalwood": [0.75, 0.6, 0.35],      // Warm wood
        "temple-rose": [0.85, 0.35, 0.45],            // Rose
        "vetiver-earth": [0.3, 0.7, 0.5],             // Green
        default: [0.886, 0.651, 0.196],
    };
    const glowColor = glowColorMap[sku] || glowColorMap.default;

    // Poll audio amplitude and update intensity for shader sync
    useEffect(() => {
        if (!audioActive) return;

        const updateAmplitude = () => {
            const amp = getAmplitude();
            // Map raw amplitude (0–1) to visible intensity range
            setIntensity(0.3 + amp * 2.5);
            rafRef.current = requestAnimationFrame(updateAmplitude);
        };
        rafRef.current = requestAnimationFrame(updateAmplitude);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [audioActive]);

    return (
        <CelestialScene
            intensity={intensity}
            glowColor={glowColor}
            showSmoke={false} // Cleaner for ritual focus
        />
    );
}

export default function SensoryEngine({ sku = "champa-jyoti", onReady }) {
    const [audioActive, setAudioActive] = useState(false);
    const [audioEngine, setAudioEngine] = useState(null);
    const containerRef = useRef();

    const solfeggioConfig = SOLFEGGIO_MAP[sku] || SOLFEGGIO_MAP.default;
    const ritual = useMemo(() => getRitualBySku(sku), [sku]);

    // Start audio on user gesture
    const activateAudio = useCallback(async () => {
        if (audioActive) return;
        try {
            const engine = await startSacredTone({
                frequency: solfeggioConfig.frequency,
                url: ritual.audioFile,
                tremoloRate: 4 // 4Hz tremolo — breathing rhythm
            });
            setAudioEngine(engine);
            setAudioActive(true);
            if (onReady) onReady();
        } catch (err) {
            console.warn("Audio activation failed:", err);
        }
    }, [audioActive, solfeggioConfig.frequency, ritual.audioFile, onReady]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioEngine) {
                audioEngine.stop();
            }
        };
    }, [audioEngine]);

    return (
        <div
            ref={containerRef}
            id="sensory-engine"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: "100vh",
                cursor: audioActive ? "default" : "pointer",
            }}
            onClick={!audioActive ? activateAudio : undefined}
            role="button"
            tabIndex={0}
            aria-label={
                audioActive
                    ? `Sensory Engine active — ${solfeggioConfig.name} at ${solfeggioConfig.frequency}Hz`
                    : "Click to activate the Sensory Engine"
            }
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!audioActive) activateAudio();
                }
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 1.5]} // Cap pixel ratio for mobile performance
                style={{ background: "transparent" }}
            >
                <SensoryScene audioActive={audioActive} sku={sku} />
            </Canvas>

            {/* Audio indicator overlay */}
            {!audioActive && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "2rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "var(--text-secondary)",
                        fontSize: "var(--font-size-small)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.7,
                        pointerEvents: "none",
                        textAlign: "center",
                    }}
                >
                    <span style={{ display: "block", marginBottom: "0.5rem" }}>◉</span>
                    Click anywhere to begin the {solfeggioConfig.frequency}Hz ritual
                </div>
            )}

            {/* Frequency badge when active */}
            {audioActive && (
                <div
                    style={{
                        position: "absolute",
                        top: "2rem",
                        right: "2rem",
                        padding: "0.5rem 1.2rem",
                        background: "var(--bg-glass)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "100px",
                        color: "var(--accent-gold)",
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                    }}
                >
                    ◉ {solfeggioConfig.frequency}Hz — {solfeggioConfig.name}
                </div>
            )}
        </div>
    );
}
