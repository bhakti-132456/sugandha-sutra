"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { name: "Sanctuary", href: "/" },
    { name: "Rituals", href: "#video-scrub-ritual" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            style={{
                position: "fixed",
                top: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                width: "max-content",
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                background: "var(--bg-glass)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--glass-shadow)",
                borderRadius: "100px",
            }}
        >
            {/* Brand Icon */}
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
                <img
                    src="/favicon.svg"
                    alt="Sugandha Sutra Mandala"
                    style={{ width: "24px", height: "24px", opacity: 0.8 }}
                />
            </Link>

            {/* Nav Links */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        style={{
                            fontSize: "0.7rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: pathname === link.href ? "var(--accent-gold)" : "var(--text-secondary)",
                            textDecoration: "none",
                            transition: "color 0.4s var(--ease-float)",
                            position: "relative",
                            padding: "0.5rem 0",
                        }}
                    >
                        <motion.span
                            whileHover={{ color: "var(--accent-gold)" }}
                        >
                            {link.name}
                        </motion.span>
                        {pathname === link.href && (
                            <motion.div
                                layoutId="nav-underline"
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: "1px",
                                    background: "var(--accent-gold)",
                                }}
                            />
                        )}
                    </Link>
                ))}
            </div>
        </motion.nav>
    );
}
