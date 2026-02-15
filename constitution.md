# 🕉️ SUGANDHA SUTRA PORTAL — CONSTITUTION

> This document is the **supreme law** for all agents, developers, and contributors working on the Sugandha Sutra Portal. Every design decision, code commit, and creative direction must align with the principles articulated herein.

---

## I. AESTHETIC MANDATE: "Zero-Gravity" Minimalist Luxury

### 1.1 Color Philosophy
- **No pure black (`#000000`).** Use deep greys (`hsl(0, 0%, 6%)` to `hsl(0, 0%, 12%)`) as the dark foundation.
- **No pure white (`#ffffff`).** Use soft off-whites (`hsl(0, 0%, 92%)` to `hsl(0, 0%, 96%)`).
- **All colors MUST be defined as HSL variables** in `globals.css` for maximum control and consistency.
- **Primary Accent:** `hsl(38, 85%, 55%)` — Turmeric Gold. Represents the warmth of sacred aromatics.
- **Secondary Accent:** `hsl(270, 45%, 60%)` — Mystic Violet. Represents spiritual transcendence.
- **Tertiary Accent:** `hsl(165, 55%, 45%)` — Vetiver Green. Represents grounding and nature.

### 1.2 Visual Language
- **High-Contrast Dark Mode** is the default and only mode.
- **Glassmorphism (Frosted Glass):** Panels use `backdrop-filter: blur(20px)` with semi-transparent HSL backgrounds.
- **Anti-Grid Layout:** Layouts must feel organic and flowing, never rigid or boxy. CSS Grid is permitted but must create asymmetric, breathing compositions.
- **Typography:** Use `Geist` (sans-serif) as the primary font. Use `Geist Mono` for code/data elements. Font weights: 300 (light), 400 (regular), 600 (semibold).
- **Spacing:** Generous whitespace. Elements must "breathe." Minimum section padding: `clamp(4rem, 10vw, 8rem)`.

### 1.3 Motion & Animation
- **Framer Motion** is the animation library.
- All animations must feel weightless — ease-out curves with long durations (0.8s–1.5s).
- Micro-interactions on every interactive element (hover, focus, click).
- Page transitions: fade + subtle vertical drift (translateY ±20px).
- No jarring, snappy animations. Everything floats.

---

## II. PERFORMANCE MANDATE

### 2.1 Lighthouse Target
- **Performance:** > 95
- **Accessibility:** > 95
- **Best Practices:** > 95
- **SEO:** > 95

### 2.2 Image Policy
- **100% CC0 images** sourced from Unsplash.
- All images must be optimized using Next.js `<Image />` component with `priority` and `placeholder="blur"` where applicable.
- Lazy-load all below-the-fold images.
- Use WebP format where possible.

### 2.3 Code Splitting
- Use `next/dynamic` for heavy components (Three.js, Tone.js).
- Bundle size must remain under 200KB for initial JS payload.

---

## III. TONE & VOICE

### 3.1 Brand Voice
- **Reverent:** Treat every word as a sacred offering. No casual, throwaway copy.
- **Spiritual:** Embrace Vedic, contemplative, and meditative language.
- **Tech-Forward:** Merge ancient wisdom with cutting-edge technology. Speak of "computational ritual," "algorithmic incense," "frequency healing."
- **Examples:**
  - ✅ "The Vessel of Your Becoming"
  - ✅ "Activate Your Sanctuary"
  - ❌ "Click here to get started"
  - ❌ "Check out our products"

### 3.2 Content Guidelines
- Headings: Poetic, evocative, maximum 8 words.
- Body text: Clear, contemplative, never exceeding 3 sentences per paragraph.
- No exclamation marks. No ALL CAPS (except brand acronyms).

---

## IV. TECHNOLOGY STACK

### 4.1 Core
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | JavaScript (ES2024+) |
| Styling | Tailwind CSS + HSL Custom Properties |
| Animation | Framer Motion |
| 3D Visuals | Three.js via @react-three/fiber + @react-three/drei |
| Generative Audio | Tone.js |
| Shaders | GLSL (custom fragment shaders) |

### 4.2 Architecture Principles
- **Component-first:** Every visual element is a reusable React component.
- **Server Components by default:** Use `"use client"` only when interactivity is required.
- **Dynamic imports** for Three.js and Tone.js to preserve performance.
- **Semantic HTML5** throughout. Proper heading hierarchy.

---

## V. SENSORY ENGINE SPECIFICATIONS

### 5.1 Visual Layer (Three.js)
- **Sacred Geometry:** Render the **Flower of Life** as an icosphere with wireframe overlay.
- **Anti-Gravity Physics:** Object drifts gently based on cursor position (lerped parallax).
- **Glow Shader:** Custom GLSL fragment shader with emissive bloom, pulsing in sync with audio.

### 5.2 Audio Layer (Tone.js)
- **Base Frequency:** 528Hz sine wave (the "Love Frequency" in Solfeggio scale).
- **Tremolo:** 4Hz pulse rate to simulate breathing rhythm.
- **Volume Envelope:** Smooth attack (0.5s), sustain, and release.
- **User-Initiated:** Audio must ONLY start on explicit user interaction (click).

### 5.3 Audio-Visual Sync
- Audio volume envelope drives shader `u_intensity` uniform.
- Glow brightness, geometry scale, and particle emission rate respond to the audio's amplitude.

---

## VI. ACCESSIBILITY

- All interactive elements must have `aria-label` attributes.
- Color contrast ratio must meet WCAG 2.1 AA standards (4.5:1 for text).
- Keyboard navigation must work for all interactive elements.
- Respect `prefers-reduced-motion` — disable animations when requested.
- Audio must never autoplay. Always require user interaction.

---

## VII. FILE STRUCTURE CONVENTION

```
sugandha-sutra-portal/
├── app/
│   ├── globals.css          # Theme variables + global styles
│   ├── layout.js            # Root layout with fonts + metadata
│   ├── page.js              # The Sanctuary (landing page)
│   └── sanctuary/
│       └── page.js          # Immersive portal (post-CTA)
├── components/
│   ├── SensoryEngine.js     # Three.js + Tone.js immersive component
│   ├── FlowerOfLife.js      # Sacred geometry 3D mesh
│   ├── GlowShader.js        # GLSL shader material
│   └── HeroSection.js       # Landing page hero
├── lib/
│   └── audio.js             # Tone.js audio engine utilities
├── public/
│   └── textures/            # CC0 images from Unsplash
├── constitution.md           # THIS FILE — the supreme law
└── package.json
```

---

## VIII. AMENDMENT PROCESS

This constitution may only be amended by:
1. A human principal with full project authority.
2. An explicit, documented request with reasoning.
3. All amendments must be logged at the bottom of this document.

---

*Drafted on the auspicious day of Maha Shivaratri consciousness, 2026.*
*May every pixel serve the sacred. 🙏*
