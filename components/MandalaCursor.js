"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function MandalaCursor() {
    const [isVisible, setIsVisible] = useState(false);

    // Smooth spring physics for the cursor
    const mouseX = useSpring(0, { damping: 30, stiffness: 250, mass: 0.5 });
    const mouseY = useSpring(0, { damping: 30, stiffness: 250, mass: 0.5 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseenter", handleMouseEnter);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isVisible, mouseX, mouseY]);

    if (!isVisible) return null;

    return (
        <motion.div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                x: mouseX,
                y: mouseY,
                pointerEvents: "none",
                zIndex: 9999,
                width: 32,
                height: 32,
                marginLeft: -16,
                marginTop: -16,
            }}
        >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Shadow/Stroke for definition */}
                <circle cx="50" cy="50" r="45" stroke="#000" strokeWidth="4" />

                {/* Intricate Mandala Pattern in Gold */}
                <circle cx="50" cy="50" r="40" stroke="#d4a644" strokeWidth="1.5" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="25" stroke="#d4a644" strokeWidth="1" />

                {[...Array(8)].map((_, i) => (
                    <path
                        key={i}
                        d="M50 20 L55 50 L50 80 L45 50 Z"
                        fill="#d4a644"
                        opacity="0.8"
                        transform={`rotate(${i * 45} 50 50)`}
                    />
                ))}

                <circle cx="50" cy="50" r="6" fill="#d4a644" />
                <circle cx="50" cy="50" r="3" fill="#000" />
            </svg>
        </motion.div>
    );
}
