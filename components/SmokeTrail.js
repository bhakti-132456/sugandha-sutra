"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function SmokeTrail({ count = 80 }) {
    const { mouse, viewport } = useThree();
    const pointsRef = useRef();

    // Particle Data: Position (3), Life (1), Velocity (2)
    const particles = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const life = new Float32Array(count);
        const vel = new Float32Array(count * 2);

        for (let i = 0; i < count; i++) {
            life[i] = -1.0; // Inactive
        }
        return { pos, life, vel };
    }, [count]);

    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(particles.pos, 3));
        g.setAttribute("life", new THREE.BufferAttribute(particles.life, 1));
        return g;
    }, [particles, count]);

    // Simple smoke wisp shader
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending, // Switch to matte ink-like blending
            uniforms: {
                uColor: { value: new THREE.Color("#555555") }, // Darker, matte smoke
                uTime: { value: 0 },
            },
            vertexShader: `
        attribute float life;
        varying float vLife;
        void main() {
          vLife = life;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Thinner trail: reduced base size
          float size = 20.0 * (1.0 - life) * (1.0 - abs(life - 0.5) * 2.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        uniform vec3 uColor;
        varying float vLife;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          // Absolute stillness: linear alpha falloff with NO shimmer/noise
          float alpha = smoothstep(0.5, 0.1, dist) * (1.0 - vLife) * 0.10;
          gl_FragColor = vec4(uColor, alpha);
        }
      `
        });
    }, []);

    const lastPos = useRef(new THREE.Vector2(0, 0));
    const isPressed = useRef(false);
    const holdTime = useRef(0);

    // Track pointer state globally to allow interaction across the scene
    useMemo(() => {
        if (typeof window === "undefined") return;

        const handleDown = () => (isPressed.current = true);
        const handleUp = () => {
            isPressed.current = false;
            holdTime.current = 0;
        };

        window.addEventListener("pointerdown", handleDown);
        window.addEventListener("pointerup", handleUp);
        window.addEventListener("pointercancel", handleUp);

        return () => {
            window.removeEventListener("pointerdown", handleDown);
            window.removeEventListener("pointerup", handleUp);
            window.removeEventListener("pointercancel", handleUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        material.uniforms.uTime.value = state.clock.elapsedTime;

        // Current cursor/touch position in 3D world coordinates
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        const currentPos = new THREE.Vector2(x, y);

        // Update existing particles
        const positions = pointsRef.current.geometry.attributes.position.array;
        const life = pointsRef.current.geometry.attributes.life.array;

        for (let i = 0; i < count; i++) {
            if (life[i] >= 0) {
                life[i] += delta * 0.45; // Refined dissipation speed
                if (life[i] > 1.0) life[i] = -1.0;

                // Drift: particles move slightly upward/randomly as they fade
                const idx = i * 3;
                positions[idx] += particles.vel[i * 2] * delta * 0.4;
                positions[idx + 1] += (particles.vel[i * 2 + 1] + 0.15) * delta * 0.4; // Upward drift
            }
        }

        // Interaction Logic
        if (isPressed.current) {
            holdTime.current += delta;
        }

        const dist = currentPos.distanceTo(lastPos.current);
        // Spawn on movement OR if holding (to emulate constant smoke)
        const shouldSpawn = dist > 0.015 || (isPressed.current && state.clock.elapsedTime % 0.05 < delta);

        if (shouldSpawn) {
            // How much to "perturb" the smoke based on hold duration
            const agitation = Math.min(1.0, holdTime.current * 0.5);
            const spread = 0.05 + agitation * 0.2;

            // Find inactive particle to spawn
            for (let i = 0; i < count; i++) {
                if (life[i] < 0) {
                    life[i] = 0;
                    // Spawn with slight jitter for organic look
                    positions[i * 3] = x + (Math.random() - 0.5) * spread;
                    positions[i * 3 + 1] = y + (Math.random() - 0.5) * spread;
                    positions[i * 3 + 2] = 0;

                    // Compute velocity: base upward drift + random turbulence
                    // Turbulence increases the longer you hold/touch
                    particles.vel[i * 2] = (Math.random() - 0.5) * (0.1 + agitation * 0.4);
                    particles.vel[i * 2 + 1] = (Math.random() - 0.5) * (0.1 + agitation * 0.2);
                    break;
                }
            }
            lastPos.current.copy(currentPos);
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.life.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry} material={material} />
    );
}
