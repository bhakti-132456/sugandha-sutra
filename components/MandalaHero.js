"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * MandalaHero
 * 
 * An interactive, breathing sacred geometry element.
 * - Idle: Subtle "breathing" scale/opacity pulse.
 * - Interactive: Rotates towards mouse movement + illuminated by cursor position.
 */
export default function MandalaHero() {
    const containerRef = useRef(null);

    // Mouse position state (0-1 normalized)
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth physics for rotation
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 150, damping: 20 });

    // Weighted Z-rotation (spin) based on horizontal movement
    const rotateZ = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), { stiffness: 100, damping: 30 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            mouseX.set(clientX / innerWidth);
            mouseY.set(clientY / innerHeight);

            // Update CSS variables for the illumination shader effect
            if (containerRef.current) {
                containerRef.current.style.setProperty("--mouse-x", `${clientX}px`);
                containerRef.current.style.setProperty("--mouse-y", `${clientY}px`);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div
            ref={containerRef}
            className="mandala-hero-container"
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 0, // Behind text
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                perspective: "1000px",
            }}
        >
            <motion.div
                style={{
                    width: "min(800px, 90vw)",
                    height: "min(800px, 90vw)",
                    color: "var(--accent-gold)", // Base color
                    rotateX,
                    rotateY,
                    rotateZ,
                    // Illumination mask
                    maskImage: "radial-gradient(circle at var(--mouse-x) var(--mouse-y), black 30%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black 30%, transparent 70%)",
                }}
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.45, 0.3],
                }}
                transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            >
                {/* Flower of Life SVG */}
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.3"
                    style={{ width: "100%", height: "100%", overflow: "visible" }}
                >
                    {/* Outer Circles */}
                    <circle cx="50" cy="50" r="48" strokeOpacity="0.5" />
                    <circle cx="50" cy="50" r="40" strokeOpacity="0.3" />

                    {/* Seed of Life Pattern */}
                    <g opacity="0.8">
                        <circle cx="50" cy="50" r="15" />
                        <circle cx="50" cy="35" r="15" />
                        <circle cx="63" cy="42.5" r="15" />
                        <circle cx="63" cy="57.5" r="15" />
                        <circle cx="50" cy="65" r="15" />
                        <circle cx="37" cy="57.5" r="15" />
                        <circle cx="37" cy="42.5" r="15" />
                    </g>

                    {/* Expanded Flower Pattern (Simplified for performance) */}
                    <g opacity="0.4" transform="rotate(30 50 50)">
                        <circle cx="50" cy="20" r="15" />
                        <circle cx="76" cy="35" r="15" />
                        <circle cx="76" cy="65" r="15" />
                        <circle cx="50" cy="80" r="15" />
                        <circle cx="24" cy="65" r="15" />
                        <circle cx="24" cy="35" r="15" />
                    </g>
                </svg>
            </motion.div>

            {/* Base Glow Layer (Always visible, behind the mask) */}
            <motion.div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.1,
                    rotateX, // Match rotation
                    rotateY,
                    rotateZ,
                }}
            >
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="var(--accent-gold)"
                    strokeWidth="0.1"
                    style={{ width: "min(800px, 90vw)", height: "min(800px, 90vw)" }}
                >
                    {/* Duplicate Geometry for faint background presence */}
                    <circle cx="50" cy="50" r="48" />
                    <g opacity="0.5">
                        <circle cx="50" cy="50" r="15" />
                        <circle cx="50" cy="35" r="15" />
                        <circle cx="63" cy="42.5" r="15" />
                        <circle cx="63" cy="57.5" r="15" />
                        <circle cx="50" cy="65" r="15" />
                        <circle cx="37" cy="57.5" r="15" />
                        <circle cx="37" cy="42.5" r="15" />
                    </g>
                </svg>
            </motion.div>
        </div>
    );
}
