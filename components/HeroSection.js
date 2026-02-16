"use client";

/**
 * Sugandha Sutra — HeroSection
 * Text-only hero with organic anti-grid layout.
 * Uses Framer Motion for zero-gravity entrance animations.
 */

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import CelestialMandala from "./CelestialMandala";
import MandalaCursor from "./MandalaCursor";

gsap.registerPlugin(ScrollToPlugin);

// Stagger animation variants
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const floatUp = {
    hidden: {
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 1.5, ease: "easeOut" },
    },
};

export default function HeroSection() {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleActivate = () => {
        setIsTransitioning(true);

        // 1. Smooth scroll to ritual section
        gsap.to(window, {
            duration: 1.5,
            scrollTo: "#video-scrub-ritual",
            ease: "power2.inOut",
            onComplete: () => setIsTransitioning(false)
        });
    };

    return (
        <>
            {/* Transition overlay */}
            {isTransitioning && (
                <motion.div
                    className="sanctuary-transition-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{
                            color: "var(--accent-gold)",
                            fontSize: "var(--font-size-small)",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                        }}
                    >
                        Entering the Sanctuary
                    </motion.span>
                </motion.div>
            )}

            <section
                id="hero-section"
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "var(--space-section)",
                    cursor: "none", // Hide system cursor
                }}
            >
                {/* Custom Interactive Mandala Cursor */}
                <MandalaCursor />

                {/* Background ambience layers */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                    }}
                >
                    {/* Smoke-like gradient orbs for organic depth */}
                    <div
                        style={{
                            position: "absolute",
                            top: "10%",
                            right: "15%",
                            width: "min(600px, 50vw)",
                            height: "min(600px, 50vw)",
                            background:
                                "radial-gradient(ellipse, hsla(38, 85%, 55%, 0.06) 0%, transparent 70%)",
                            filter: "blur(60px)",
                            animation: "gentle-float 12s ease-in-out infinite",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "5%",
                            left: "10%",
                            width: "min(500px, 45vw)",
                            height: "min(500px, 45vw)",
                            background:
                                "radial-gradient(ellipse, hsla(270, 45%, 60%, 0.05) 0%, transparent 70%)",
                            filter: "blur(80px)",
                            animation: "gentle-float 15s ease-in-out infinite reverse",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "min(400px, 35vw)",
                            height: "min(400px, 35vw)",
                            background:
                                "radial-gradient(ellipse, hsla(165, 55%, 45%, 0.04) 0%, transparent 70%)",
                            filter: "blur(50px)",
                            animation: "sacred-pulse 8s ease-in-out infinite",
                        }}
                    />
                </div>

                {/* Celestial Mandala Interaction Layer */}
                <CelestialMandala minimal />

                {/* Hero content — anti-grid, organic placement */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        position: "relative",
                        zIndex: 1, // Above Mandala
                        maxWidth: "min(900px, 85vw)",
                        textAlign: "center",
                    }}
                >
                    {/* Sacred mark */}
                    <motion.div
                        variants={fadeIn}
                        style={{
                            marginBottom: "var(--space-lg)",
                            color: "var(--accent-gold)",
                            fontSize: "1.5rem",
                            opacity: 0.6,
                        }}
                        aria-hidden="true"
                    >
                        ◯
                    </motion.div>

                    {/* Brand name */}
                    <motion.p
                        variants={floatUp}
                        style={{
                            fontSize: "var(--font-size-small)",
                            letterSpacing: "0.35em",
                            textTransform: "uppercase",
                            color: "var(--accent-gold)",
                            marginBottom: "var(--space-md)",
                            fontWeight: 400,
                        }}
                    >
                        Sugandha Sutra
                    </motion.p>

                    {/* Main headline */}
                    <motion.h1
                        variants={floatUp}
                        className="text-glow-gold"
                        style={{
                            fontSize: "var(--font-size-hero)",
                            fontWeight: 300,
                            lineHeight: 1.05,
                            color: "var(--text-primary)",
                            marginBottom: "var(--space-lg)",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        The Vessel of
                        <br />
                        <span style={{ color: "var(--accent-gold)" }}>Your Becoming</span>
                    </motion.h1>

                    {/* Sacred divider */}
                    <motion.div
                        variants={fadeIn}
                        className="sacred-divider"
                        style={{ margin: "0 auto var(--space-lg)" }}
                    />

                    {/* Sub-headline */}
                    <motion.p
                        variants={floatUp}
                        style={{
                            fontSize: "var(--font-size-body)",
                            color: "var(--text-secondary)",
                            maxWidth: "680px",
                            margin: "0 auto",
                            marginBottom: "var(--space-lg)",
                            lineHeight: 1.8,
                        }}
                    >
                        Sugandha Sutra is a curated healing ecosystem where ancient Vedic
                        aromatics meet the future of computational ritual. Experience the
                        transcendence of smell, sound, and sight.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div variants={floatUp}>
                        <motion.button
                            className="sanctuary-btn"
                            onClick={handleActivate}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            aria-label="Activate Your Sanctuary — enter the immersive experience"
                            id="cta-activate-sanctuary"
                        >
                            <span
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "var(--bg-void)",
                                    display: "inline-block",
                                    animation: "breathe 3s ease-in-out infinite",
                                }}
                                aria-hidden="true"
                            />
                            Activate Your Sanctuary
                        </motion.button>
                    </motion.div>

                    {/* Bottom floating hint */}
                    <motion.p
                        variants={fadeIn}
                        style={{
                            marginTop: "var(--space-section)",
                            fontSize: "0.75rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                        }}
                    >
                        Scroll to explore the rituals below
                    </motion.p>
                </motion.div>

                {/* Unsplash background images — subtle blurred textures */}
                {/* Minimalist smoke art — CC0 */}
                <img
                    src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=30&auto=format"
                    alt="Ethereal wisps of minimalist smoke art creating organic patterns against a dark background"
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "50%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        opacity: 0.04,
                        filter: "blur(3px) saturate(0.3)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                    loading="eager"
                    aria-hidden="true"
                />
                {/* Handcrafted wooden texture — CC0 */}
                <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=30&auto=format"
                    alt="Handcrafted wooden surface texture with natural grain patterns"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "40%",
                        height: "60%",
                        objectFit: "cover",
                        objectPosition: "center",
                        opacity: 0.03,
                        filter: "blur(4px) saturate(0.2)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                    loading="eager"
                    aria-hidden="true"
                />
            </section>
        </>
    );
}
