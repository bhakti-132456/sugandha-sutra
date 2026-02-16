"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Scanline, DepthOfField } from "@react-three/postprocessing";
import FlowerOfLife from "./FlowerOfLife";
import StarfieldParticles from "./StarfieldParticles";
import NebulaBackground from "./NebulaShader";
import SmokeTrail from "./SmokeTrail";

/**
 * CelestialScene — The core 3D scene elements.
 * Exported separately so it can be used inside different Canvases (Hero vs Ritual).
 */
export function CelestialScene({
    intensity = 0.5,
    glowColor,
    nebulaOpacity = 0.25,
    showSmoke = true,
    rotationSpeed = 1
}) {
    const { mouse, viewport } = useThree();
    const groupRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Parallax effect based on mouse
        if (groupRef.current) {
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.2, 0.1);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2, 0.1);

            // Subtle constant rotation or scroll-driven rotation can be added here
            groupRef.current.rotation.z += 0.001 * rotationSpeed;
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />

            <group ref={groupRef}>
                <Suspense fallback={null}>
                    <Float
                        speed={2}
                        rotationIntensity={0.5}
                        floatIntensity={0.5}
                        floatingRange={[-0.2, 0.2]}
                    >
                        <FlowerOfLife intensity={intensity} glowColor={glowColor} />
                    </Float>

                    <StarfieldParticles count={3000} />
                    <NebulaBackground />
                    {showSmoke && <SmokeTrail count={50} />}
                </Suspense>
            </group>

            <EffectComposer disableNormalPass>
                <DepthOfField
                    focusDistance={0.01}
                    focalLength={0.2}
                    bokehScale={3}
                />
                <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    intensity={1.2 + intensity * 0.4}
                    radius={0.4}
                />
                <Noise opacity={0.05} />
                <Scanline opacity={0.03} />
            </EffectComposer>

            {/* Dark Readability Overlay Mesh — subtle vignette for text */}
            <mesh position={[0, 0, 2.5]}>
                <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
                <meshBasicMaterial color="#000" transparent opacity={0.35} />
            </mesh>

            {/* Dynamic Glow Orbs for additional depth */}
            <mesh position={[-5, 2, -15]} scale={5}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#4a1e9e" transparent opacity={0.05} />
            </mesh>
            <mesh position={[5, -3, -12]} scale={6}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#886100" transparent opacity={0.05} />
            </mesh>
        </>
    );
}

/**
 * CelestialMandala — The Hero implementation with its own Canvas.
 */
export default function CelestialMandala() {
    return (
        <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: "radial-gradient(circle at center, #08080a 0%, #000 100%)"
        }}>
            <Canvas
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <CelestialScene intensity={0.5} />
            </Canvas>
        </div>
    );
}
