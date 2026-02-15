import { RITUAL_DATA, getAllSkus } from "@/lib/ritualData";

/**
 * Generate static params for all known SKUs.
 * This enables static generation for better performance.
 */
export async function generateStaticParams() {
    return getAllSkus().map((sku) => ({ sku }));
}

/**
 * Dynamic metadata based on SKU.
 */
export async function generateMetadata({ params }) {
    const { sku } = await params;
    const ritual = RITUAL_DATA[sku];

    if (!ritual) {
        return {
            title: "Ritual Not Found — Sugandha Sutra",
            description: "This ritual has not yet been revealed.",
        };
    }

    return {
        title: `${ritual.name}: ${ritual.tagline} — Sugandha Sutra`,
        description: ritual.hero.description,
        openGraph: {
            title: `${ritual.name} — Sugandha Sutra`,
            description: ritual.hero.description,
            images: [{ url: ritual.unsplashImage }],
        },
    };
}

export { default } from "./RitualPageClient";
