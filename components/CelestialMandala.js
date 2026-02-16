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
    rotationSpeed = 1,
    minimal = false // Performance mode for Hero
}) {
    const { mouse, viewport } = useThree();
    const groupRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Parallax effect based on mouse
        if (groupRef.current) {
            // Much subtler movement in minimal mode
            const factor = minimal ? 0.05 : 0.2;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * factor, 0.1);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * factor, 0.1);

            groupRef.current.rotation.z += 0.001 * rotationSpeed * (minimal ? 0.5 : 1);
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={minimal ? 0.8 : 1.5} color="#ffd700" />

            <group ref={groupRef}>
                <Suspense fallback={null}>
                    <Float
                        speed={minimal ? 1 : 2}
                        rotationIntensity={minimal ? 0.2 : 0.5}
                        floatIntensity={minimal ? 0.2 : 0.5}
                        floatingRange={[-0.1, 0.1]}
                    >
                        <FlowerOfLife intensity={intensity} glowColor={glowColor} />
                    </Float>

                    {/* Hide background heavy assets in minimal mode */}
                    {!minimal && (
                        <>
                            <StarfieldParticles count={3000} />
                            <NebulaBackground />
                        </>
                    )}

                    {showSmoke && <SmokeTrail count={minimal ? 100 : 80} />}
                </Suspense>
            </group>

            <EffectComposer disableNormalPass>
                {!minimal && (
                    <DepthOfField
                        focusDistance={0.01}
                        focalLength={0.2}
                        bokehScale={3}
                    />
                )}
                <Bloom
                    luminanceThreshold={minimal ? 0.4 : 0.2}
                    mipmapBlur
                    intensity={minimal ? 0.8 : 1.2 + intensity * 0.4}
                    radius={0.4}
                />
                {!minimal && (
                    <>
                        <Noise opacity={0.05} />
                        <Scanline opacity={0.03} />
                    </>
                )}
            </EffectComposer>

            {/* Dark Readability Overlay Mesh — subtle vignette for text */}
            <mesh position={[0, 0, 2.5]}>
                <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
                <meshBasicMaterial color="#000" transparent opacity={minimal ? 0.5 : 0.35} />
            </mesh>

            {/* Dynamic Glow Orbs for additional depth — subtle hints */}
            {!minimal && (
                <>
                    <mesh position={[-5, 2, -15]} scale={5}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#4a1e9e" transparent opacity={0.05} />
                    </mesh>
                    <mesh position={[5, -3, -12]} scale={6}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#886100" transparent opacity={0.05} />
                    </mesh>
                </>
            )}
        </>
    );
}

/**
 * CelestialMandala — The Hero implementation with its own Canvas.
 */
export default function CelestialMandala({ minimal = false }) {
    return (
        <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: "radial-gradient(circle at center, #08080a 0%, #000 100%)"
        }}>
            <Canvas
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
            >
                <CelestialScene intensity={0.5} minimal={minimal} />
            </Canvas>
        </div>
    );
}
