"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function SmokeTrail({ count = 40 }) {
    const { mouse, viewport } = useThree();
    const lineRef = useRef();

    // Create an array of points for the trail
    const points = useMemo(() => {
        const p = [];
        for (let i = 0; i < count; i++) {
            p.push(new THREE.Vector3(0, 0, 0));
        }
        return p;
    }, [count]);

    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry().setFromPoints(points);
        return g;
    }, [points]);

    useFrame((state) => {
        if (!lineRef.current) return;

        // Target position based on mouse
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        const target = new THREE.Vector3(x, y, 0);

        // Shift points
        for (let i = count - 1; i > 0; i--) {
            points[i].copy(points[i - 1]);
            // Add subtle organic drift to the tail
            points[i].x += Math.sin(state.clock.elapsedTime + i) * 0.01;
            points[i].y += Math.cos(state.clock.elapsedTime + i) * 0.01;
        }
        points[0].lerp(target, 0.2); // Smoothly follow the mouse

        lineRef.current.geometry.setFromPoints(points);
    });

    return (
        <line ref={lineRef} geometry={geometry}>
            <lineBasicMaterial
                color="var(--accent-gold)"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                linewidth={1}
            />
        </line>
    );
}
