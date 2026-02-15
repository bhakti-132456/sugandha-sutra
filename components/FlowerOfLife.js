"use client";

/**
 * Sugandha Sutra — Flower of Life Sacred Geometry
 * A procedurally generated Flower of Life pattern rendered as a
 * wireframe icosphere with custom GLSL glow shader.
 * Implements anti-gravity floating physics based on cursor position.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./GlowShader"; // Registers <sacredGlowMaterial />

export default function FlowerOfLife({ intensity = 0.5, glowColor }) {
    const groupRef = useRef();
    const materialRef = useRef();
    const mousePos = useRef({ x: 0, y: 0 });
    const smoothPos = useRef({ x: 0, y: 0 });

    // Convert HSL-style glowColor to RGB array, or use default gold
    const glowRGB = useMemo(() => {
        if (glowColor) return glowColor;
        return [0.886, 0.651, 0.196]; // Turmeric Gold
    }, [glowColor]);

    // Generate Flower of Life circle positions
    const circlePositions = useMemo(() => {
        const positions = [];
        const radius = 0.6;
        // Center circle
        positions.push([0, 0]);
        // First ring — 6 circles
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            positions.push([
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
            ]);
        }
        // Second ring — 6 circles
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + Math.PI / 6;
            positions.push([
                Math.cos(angle) * radius * 1.73,
                Math.sin(angle) * radius * 1.73,
            ]);
        }
        return positions;
    }, []);

    // Track mouse for anti-gravity parallax
    useMemo(() => {
        if (typeof window === "undefined") return;
        const handler = (e) => {
            mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handler, { passive: true });
        return () => window.removeEventListener("mousemove", handler);
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current || !materialRef.current) return;

        const time = state.clock.elapsedTime;

        // Anti-gravity floating — lerped smooth cursor tracking
        smoothPos.current.x += (mousePos.current.x - smoothPos.current.x) * 0.02;
        smoothPos.current.y += (mousePos.current.y - smoothPos.current.y) * 0.02;

        // Apply anti-gravity drift
        groupRef.current.rotation.x =
            smoothPos.current.y * 0.3 + Math.sin(time * 0.3) * 0.05;
        groupRef.current.rotation.y =
            smoothPos.current.x * 0.3 + Math.cos(time * 0.2) * 0.05;
        groupRef.current.rotation.z = Math.sin(time * 0.15) * 0.02;

        // Gentle levitation bob
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.15;

        // Breathe scale with audio intensity
        const breathe = 1 + intensity * 0.08;
        groupRef.current.scale.setScalar(breathe);

        // Update shader uniforms
        materialRef.current.u_time = time;
        materialRef.current.u_intensity = intensity;
        materialRef.current.u_glowColor = glowRGB;
    });

    return (
        <group ref={groupRef}>
            {/* Flower of Life — concentric torus rings */}
            {circlePositions.map((pos, i) => (
                <mesh key={i} position={[pos[0], pos[1], 0]}>
                    <torusGeometry args={[0.55, 0.008, 16, 64]} />
                    <sacredGlowMaterial
                        ref={i === 0 ? materialRef : undefined}
                        transparent
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}

            {/* Central icosphere for volumetric glow */}
            <mesh>
                <icosahedronGeometry args={[0.35, 2]} />
                <meshBasicMaterial
                    color={new THREE.Color(...glowRGB)}
                    transparent
                    opacity={0.04 + intensity * 0.06}
                    wireframe
                    depthWrite={false}
                />
            </mesh>

            {/* Outer boundary ring */}
            <mesh>
                <torusGeometry args={[1.65, 0.004, 8, 128]} />
                <meshBasicMaterial
                    color={new THREE.Color(...glowRGB)}
                    transparent
                    opacity={0.15}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}
