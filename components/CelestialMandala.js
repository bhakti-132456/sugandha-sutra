"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Scanline } from "@react-three/postprocessing";
import FlowerOfLife from "./FlowerOfLife";
import StarfieldParticles from "./StarfieldParticles";
import NebulaBackground from "./NebulaShader";

function Scene() {
    const { mouse, viewport } = useThree();
    const groupRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Parallax effect based on mouse
        if (groupRef.current) {
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.2, 0.1);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2, 0.1);
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
                        <FlowerOfLife intensity={0.8} />
                    </Float>

                    <StarfieldParticles count={3000} />
                    <NebulaBackground />
                </Suspense>
            </group>

            <EffectComposer disableNormalPass>
                <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    intensity={1.2}
                    radius={0.4}
                />
                <Noise opacity={0.05} />
                <Scanline opacity={0.03} />
            </EffectComposer>

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
                <Scene />
            </Canvas>
        </div>
    );
}
