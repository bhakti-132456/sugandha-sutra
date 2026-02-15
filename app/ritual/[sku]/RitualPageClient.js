"use client";

/**
 * Sugandha Sutra — Ritual Page (Dynamic SKU Route)
 * /ritual/[sku]
 *
 * Detects SKU from URL and automatically configures:
 * - SensoryEngine with correct Solfeggio frequency
 * - Sacred geometry pattern
 * - Glow color
 * - Brand copy
 */

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { getRitualBySku } from "@/lib/ritualData";

// Dynamic import — code-split heavy 3D/audio
const SensoryEngine = dynamic(() => import("@/components/SensoryEngine"), {
    ssr: false,
    loading: () => (
        <div
            style={{
                height: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-deep)",
                borderRadius: "1.5rem",
            }}
        >
            <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    color: "var(--accent-gold)",
                    fontSize: "1.5rem",
                }}
            >
                ◯
            </motion.div>
        </div>
    ),
});

const floatUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
    },
};

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

export default function RitualPageClient() {
    const params = useParams();
    const sku = params?.sku || "champa-jyoti";
    const ritual = useMemo(() => getRitualBySku(sku), [sku]);
    const [engineActive, setEngineActive] = useState(false);
    const [showEngine, setShowEngine] = useState(false);

    const router = useRouter();

    const handleEnterRitual = () => {
        router.push(`/ritual/${sku}/play`);
    };

    return (
        <main style={{ background: "var(--bg-void)", minHeight: "100vh" }}>
            {/* Navigation */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: "1.5rem 2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "hsla(0, 0%, 4%, 0.8)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid var(--glass-border)",
                }}
            >
                <a
                    href="/"
                    style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "0.75rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        transition: "color 0.3s ease",
                    }}
                    aria-label="Return to the Sugandha Sutra home page"
                    id="nav-home"
                >
                    ← Sugandha Sutra
                </a>
                <span
                    style={{
                        fontSize: "0.7rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--accent-gold)",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    {ritual.frequency}Hz · {ritual.frequencyName}
                </span>
            </motion.nav>

            {/* Hero Section */}
            <section
                id="ritual-hero"
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    padding: "var(--space-section) var(--space-lg)",
                    paddingTop: "calc(var(--space-section) + 4rem)",
                    overflow: "hidden",
                }}
            >
                {/* Background image — blurred CC0 texture */}
                <img
                    src={ritual.unsplashImage}
                    alt={ritual.unsplashAlt}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.06,
                        filter: "blur(4px) saturate(0.3)",
                        pointerEvents: "none",
                        zIndex: 0,
                    }}
                    loading="eager"
                />

                {/* Gradient overlay */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, var(--bg-void) 0%, transparent 30%, transparent 70%, var(--bg-void) 100%)",
                        zIndex: 1,
                    }}
                />

                {/* Anti-grid organic layout */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    style={{
                        position: "relative",
                        zIndex: 2,
                        maxWidth: "900px",
                        margin: "0 auto",
                    }}
                >
                    {/* Frequency badge */}
                    <motion.div variants={floatUp} style={{ marginBottom: "var(--space-lg)" }}>
                        <span
                            className="glass-panel"
                            style={{
                                display: "inline-block",
                                padding: "0.5rem 1.5rem",
                                borderRadius: "100px",
                                fontSize: "0.7rem",
                                letterSpacing: "0.25em",
                                textTransform: "uppercase",
                                color: "var(--accent-gold)",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            Solfeggio · {ritual.frequency}Hz · {ritual.note}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={floatUp}
                        style={{
                            fontSize: "var(--font-size-h1)",
                            fontWeight: 300,
                            color: "var(--text-primary)",
                            lineHeight: 1.1,
                            marginBottom: "var(--space-lg)",
                        }}
                    >
                        {ritual.hero.headline.split(":")[0]}:
                        <span
                            style={{
                                display: "block",
                                color: "var(--accent-gold)",
                                marginTop: "0.25em",
                            }}
                        >
                            {ritual.hero.headline.split(":")[1]}
                        </span>
                    </motion.h1>

                    {/* Sacred divider */}
                    <motion.div
                        variants={floatUp}
                        className="sacred-divider"
                        style={{ marginBottom: "var(--space-lg)" }}
                    />

                    {/* Description */}
                    <motion.p
                        variants={floatUp}
                        style={{
                            fontSize: "var(--font-size-body)",
                            color: "var(--text-secondary)",
                            maxWidth: "700px",
                            lineHeight: 1.9,
                            marginBottom: "var(--space-lg)",
                        }}
                    >
                        {ritual.hero.description}
                    </motion.p>

                    {/* Activate Ritual CTA */}
                    <motion.div variants={floatUp}>
                        <motion.button
                            className="sanctuary-btn"
                            onClick={handleEnterRitual}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            aria-label={`Enter the ${ritual.name} ritual experience`}
                            id="cta-enter-ritual"
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
                            Begin Ritual Experience
                        </motion.button>
                    </motion.div>
                </motion.div>
            </section>

            {/* SensoryEngine Section — appears on activation */}
            <AnimatePresence>
                {showEngine && (
                    <motion.section
                        id="ritual-engine-section"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "70vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: "relative",
                            overflow: "hidden",
                            margin: "0 var(--space-lg) var(--space-section)",
                            borderRadius: "1.5rem",
                            border: "1px solid var(--glass-border)",
                        }}
                    >
                        <SensoryEngine
                            sku={sku}
                            onReady={() => setEngineActive(true)}
                        />
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Ingredients Section */}
            <section
                id="ritual-ingredients"
                style={{
                    padding: "var(--space-section) var(--space-lg)",
                }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                    }}
                >
                    <motion.p
                        variants={floatUp}
                        style={{
                            fontSize: "0.7rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "var(--accent-gold)",
                            marginBottom: "var(--space-sm)",
                        }}
                    >
                        The Composition
                    </motion.p>
                    <motion.h2
                        variants={floatUp}
                        style={{
                            fontSize: "var(--font-size-h2)",
                            fontWeight: 300,
                            color: "var(--text-primary)",
                            marginBottom: "var(--space-lg)",
                        }}
                    >
                        Sacred Ingredients
                    </motion.h2>

                    <div
                        style={{
                            display: "grid",
                            gap: "var(--space-sm)",
                        }}
                    >
                        {ritual.ingredients.map((ingredient, i) => (
                            <motion.div
                                key={i}
                                variants={floatUp}
                                className="glass-panel"
                                style={{
                                    padding: "1.2rem 1.8rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                }}
                            >
                                <span
                                    style={{
                                        color: "var(--accent-gold)",
                                        fontSize: "0.6rem",
                                        opacity: 0.6,
                                        fontFamily: "var(--font-mono)",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span
                                    style={{
                                        fontSize: "var(--font-size-body)",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    {ingredient}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Science Section — Computational Healing */}
            <section
                id="ritual-science"
                style={{
                    padding: "var(--space-section) var(--space-lg)",
                    borderTop: "1px solid var(--glass-border)",
                }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={stagger}
                    style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                    }}
                >
                    <motion.p
                        variants={floatUp}
                        style={{
                            fontSize: "0.7rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "var(--accent-violet)",
                            marginBottom: "var(--space-sm)",
                        }}
                    >
                        The Science
                    </motion.p>
                    <motion.h2
                        variants={floatUp}
                        style={{
                            fontSize: "var(--font-size-h2)",
                            fontWeight: 300,
                            color: "var(--text-primary)",
                            marginBottom: "var(--space-lg)",
                        }}
                    >
                        {ritual.science.title}
                    </motion.h2>
                    <motion.div
                        variants={floatUp}
                        className="sacred-divider"
                        style={{ marginBottom: "var(--space-lg)" }}
                    />
                    <motion.p
                        variants={floatUp}
                        style={{
                            fontSize: "var(--font-size-body)",
                            color: "var(--text-secondary)",
                            lineHeight: 2,
                            maxWidth: "700px",
                        }}
                    >
                        {ritual.science.body}
                    </motion.p>

                    {/* Frequency visualization card */}
                    <motion.div
                        variants={floatUp}
                        className="glass-panel"
                        style={{
                            marginTop: "var(--space-lg)",
                            padding: "var(--space-lg)",
                            textAlign: "center",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "4rem",
                                fontWeight: 300,
                                color: "var(--accent-gold)",
                                lineHeight: 1,
                                marginBottom: "0.5rem",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            {ritual.frequency}
                            <span style={{ fontSize: "1.5rem", opacity: 0.5 }}>Hz</span>
                        </p>
                        <p
                            style={{
                                fontSize: "0.75rem",
                                letterSpacing: "0.25em",
                                textTransform: "uppercase",
                                color: "var(--text-tertiary)",
                            }}
                        >
                            Solfeggio Note: {ritual.note} · {ritual.frequencyName}
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer
                style={{
                    padding: "var(--space-lg)",
                    textAlign: "center",
                    borderTop: "1px solid var(--glass-border)",
                }}
            >
                <p
                    style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                    }}
                >
                    Sugandha Sutra · {ritual.name} · {ritual.frequency}Hz
                </p>
            </footer>
        </main>
    );
}
