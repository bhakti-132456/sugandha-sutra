import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Sugandha Sutra — The Vessel of Your Becoming",
  description:
    "A curated healing ecosystem where ancient Vedic aromatics meet the future of computational ritual. Experience the transcendence of smell, sound, and sight.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "Vedic aromatics",
    "incense",
    "sacred geometry",
    "computational healing",
    "528Hz",
    "solfeggio",
    "sandalwood",
    "champaca",
  ],
  openGraph: {
    title: "Sugandha Sutra — The Vessel of Your Becoming",
    description:
      "Ancient Vedic aromatics meet the future of computational ritual.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {/* Subtle film-grain noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
