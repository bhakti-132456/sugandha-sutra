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
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: { value: new THREE.Color("#666666") }, // Sophisticated Muted Grey
                uTime: { value: 0 },
            },
            vertexShader: `
        attribute float life;
        varying float vLife;
        void main() {
          vLife = life;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Thinner trail: reduced base size
          float size = 25.0 * (1.0 - life) * (1.0 - abs(life - 0.5) * 2.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        uniform vec3 uColor;
        varying float vLife;
        void main() {
          // Circular gradient for soft smoke effect
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * (1.0 - vLife) * 0.15;
          gl_FragColor = vec4(uColor, alpha);
        }
      `
        });
    }, []);

    const lastPos = useRef(new THREE.Vector2(0, 0));

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        material.uniforms.uTime.value = state.clock.elapsedTime;

        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        const currentMouse = new THREE.Vector2(x, y);

        // Update existing particles
        const positions = pointsRef.current.geometry.attributes.position.array;
        const life = pointsRef.current.geometry.attributes.life.array;

        for (let i = 0; i < count; i++) {
            if (life[i] >= 0) {
                life[i] += delta * 0.4; // Slightly slower life cycle for grace
                if (life[i] > 1.0) life[i] = -1.0;

                // Tighten drift spread drastically
                const idx = i * 3;
                positions[idx] += particles.vel[i * 2] * delta * 0.4;
                positions[idx + 1] += particles.vel[i * 2 + 1] * delta * 0.4;
            }
        }

        // Spawn new particle if mouse moved enough - higher threshold for thinner trail
        if (currentMouse.distanceTo(lastPos.current) > 0.1) {
            // Find inactive particle
            for (let i = 0; i < count; i++) {
                if (life[i] < 0) {
                    life[i] = 0;
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = 0;

                    // Muted random drift velocity
                    particles.vel[i * 2] = (Math.random() - 0.5) * 0.15;
                    particles.vel[i * 2 + 1] = (Math.random() - 0.5) * 0.15;
                    break;
                }
            }
            lastPos.current.copy(currentMouse);
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.life.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry} material={material} />
    );
}
