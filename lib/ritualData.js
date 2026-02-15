/**
 * Sugandha Sutra — Ritual SKU Data
 * Central data source for all incense rituals.
 * Maps SKU slugs to product details, frequencies, and geometry patterns.
 */

export const RITUAL_DATA = {
    "champa-jyoti": {
        name: "Champa Jyoti",
        tagline: "A Bridge of Light",
        frequency: 528,
        frequencyName: "Love Frequency",
        note: "Mi",
        geometryPattern: "flower-of-life",
        glowColor: [0.886, 0.651, 0.196], // Turmeric Gold
        hero: {
            headline: "Champa Jyoti: A Bridge of Light",
            description:
                "Before you is not merely an incense stick, but a tactile key to a 528Hz sanctuary. Crafted with genuine Mysore sandalwood and the golden heart of temple-grown champaca.",
        },
        science: {
            title: "Computational Healing",
            body: "Computational Healing is the heart of our mission. Each Sugandha Sutra ritual is engineered at the intersection of molecular aromatics and vibrational frequency science. The 528Hz Solfeggio frequency — known as the 'Miracle Tone' — has been shown to resonate with the heart chakra, promoting cellular repair and emotional equilibrium. We do not just scent a room; we re-tune your cellular frequency.",
        },
        ingredients: [
            "Genuine Mysore Sandalwood (Santalum album)",
            "Temple-Grown Golden Champaca (Michelia champaca)",
            "Wild Vetiver Root (Vetiveria zizanioides)",
            "Himalayan Cedar Resin",
        ],
        unsplashImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=60&auto=format",
        unsplashAlt: "Golden champaca flowers in warm temple light with wisps of aromatic smoke",
        audioFile: "/SIddheshwari Sounds Festive 1.wav",
    },

    "sacred-sandalwood": {
        name: "Sacred Sandalwood",
        tagline: "Roots of Stillness",
        frequency: 639,
        frequencyName: "Connection",
        note: "Fa",
        geometryPattern: "metatrons-cube",
        glowColor: [0.75, 0.6, 0.35],
        hero: {
            headline: "Sacred Sandalwood: Roots of Stillness",
            description:
                "A meditation anchor carved from the oldest aromatic tradition. Pure Mysore sandalwood, sun-cured for seven seasons, releasing notes that quiet the mind's ceaseless architecture.",
        },
        science: {
            title: "Computational Healing",
            body: "Computational Healing is the heart of our mission. The 639Hz frequency harmonizes interpersonal connections and facilitates emotional healing. Santalol, the primary compound in sandalwood, has been studied for its anxiolytic properties — when paired with this frequency, it creates a bio-acoustic bridge between ancient botanical wisdom and modern vibrational science. We do not just scent a room; we re-tune your cellular frequency.",
        },
        ingredients: [
            "Heritage Mysore Sandalwood (Santalum album)",
            "Wild Frankincense Tears (Boswellia sacra)",
            "Aged Agarwood Dust (Aquilaria malaccensis)",
        ],
        unsplashImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=60&auto=format",
        unsplashAlt: "Sandalwood incense sticks resting on carved wooden surface with smoke",
        audioFile: "/Siddheshwari Sounds (Lore).wav",
    },

    "temple-rose": {
        name: "Temple Rose",
        tagline: "Petals of Awakening",
        frequency: 741,
        frequencyName: "Awakening",
        note: "Sol",
        geometryPattern: "sri-yantra",
        glowColor: [0.85, 0.35, 0.45],
        hero: {
            headline: "Temple Rose: Petals of Awakening",
            description:
                "Distilled from pre-dawn rose harvests in the valleys of Kannauj. Each stick carries the essence of ten thousand petals, unlocking intuitive clarity through the 741Hz awakening frequency.",
        },
        science: {
            title: "Computational Healing",
            body: "Computational Healing is the heart of our mission. The 741Hz frequency is associated with problem-solving and self-expression. The damascenone and citronellol compounds in pure rose otto have demonstrated neurological calming effects. Together, they create a computational ritual that clears cognitive fog and sharpens intuitive perception. We do not just scent a room; we re-tune your cellular frequency.",
        },
        ingredients: [
            "Kannauj Rose Otto (Rosa damascena)",
            "Saffron Strands (Crocus sativus)",
            "Himalayan Rhododendron Honey",
        ],
        unsplashImage: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=60&auto=format",
        unsplashAlt: "Delicate rose petals scattered across stone temple steps in soft morning light",
        audioFile: "/Siddheshwari Sounds Elevation 1.wav",
    },

    "vetiver-earth": {
        name: "Vetiver Earth",
        tagline: "The Ground Beneath the Sky",
        frequency: 432,
        frequencyName: "Cosmic Harmony",
        note: "La",
        geometryPattern: "seed-of-life",
        glowColor: [0.3, 0.7, 0.5],
        hero: {
            headline: "Vetiver Earth: The Ground Beneath the Sky",
            description:
                "Born from the deepest roots of the Indian earth. Wild vetiver, hand-harvested and steam-distilled, grounding you in the 432Hz frequency of cosmic harmony — the tuning of the natural world.",
        },
        science: {
            title: "Computational Healing",
            body: "Computational Healing is the heart of our mission. The 432Hz frequency, known as 'Verdi's A,' is mathematically aligned with the patterns of nature and the universe. Vetiver's khusimol compound interacts with GABA receptors to reduce anxiety. This ritual is an algorithmic grounding — a return to the earth's own vibration. We do not just scent a room; we re-tune your cellular frequency.",
        },
        ingredients: [
            "Wild Indian Vetiver Root (Vetiveria zizanioides)",
            "Nagaland Lemongrass (Cymbopogon)",
            "Black Cardamom Pods (Amomum subulatum)",
        ],
        unsplashImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=60&auto=format",
        unsplashAlt: "Ancient tree roots intertwined with rich dark earth and green vetiver grass",
        audioFile: "/Siddheshwari Sounds (General Use).wav",
    },
};

/**
 * Get ritual data by SKU, with fallback to champa-jyoti.
 */
export function getRitualBySku(sku) {
    return RITUAL_DATA[sku] || RITUAL_DATA["champa-jyoti"];
}

/**
 * Get all available SKUs.
 */
export function getAllSkus() {
    return Object.keys(RITUAL_DATA);
}
