"use client";

/**
 * Sugandha Sutra — The Sanctuary (Landing Page)
 * The sacred entry point. Text-only hero with organic, flowing layout.
 */

import HeroSection from "@/components/HeroSection";
import VideoScrubRitual from "@/components/VideoScrubRitual";
import { motion } from "framer-motion";

const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
  },
};

// Ritual collection preview data
const rituals = [
  {
    sku: "champa-jyoti",
    name: "Champa Jyoti",
    tagline: "A Bridge of Light",
    frequency: "528Hz",
    note: "The Love Frequency",
  },
  {
    sku: "sacred-sandalwood",
    name: "Sacred Sandalwood",
    tagline: "Roots of Stillness",
    frequency: "639Hz",
    note: "Connection",
  },
  {
    sku: "temple-rose",
    name: "Temple Rose",
    tagline: "Petals of Awakening",
    frequency: "741Hz",
    note: "Awakening",
  },
  {
    sku: "vetiver-earth",
    name: "Vetiver Earth",
    tagline: "The Ground Beneath the Sky",
    frequency: "432Hz",
    note: "Cosmic Harmony",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero — The Sanctuary entrance */}
      <HeroSection />

      {/* The Burn — Scroll-driven video ritual */}
      <VideoScrubRitual />



      {/* Footer — minimal sacred */}
      <footer
        style={{
          padding: "var(--space-lg)",
          textAlign: "center",
          borderTop: "1px solid var(--glass-border)",
          position: "relative",
          zIndex: 1,
          background: "var(--bg-void)",
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
          Sugandha Sutra · Sacred Computation · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}
