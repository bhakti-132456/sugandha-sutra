"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const NebulaShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor1: new THREE.Color("#1a0b2e"), // Deep Indigo
        uColor2: new THREE.Color("#4a1e9e"), // Violet
        uColor3: new THREE.Color("#886100"), // Muted Gold
        uOpacity: 0.4,
    },
    // Vertex Shader
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
    // Fragment Shader
    `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uOpacity;
  varying vec2 vUv;

  // Simple 2D Noise
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
        v += a * smoothNoise(p);
        p = m * p * 2.0;
        a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * 3.0;
    float n = fbm(p + uTime * 0.05);
    
    vec3 color = mix(uColor1, uColor2, n);
    color = mix(color, uColor3, fbm(p - uTime * 0.02) * 0.3);
    
    float alpha = n * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
  `
);

extend({ NebulaShaderMaterial });

export default function NebulaBackground() {
    return (
        <mesh scale={[20, 20, 1]} position={[0, 0, -10]}>
            <planeGeometry args={[2, 2]} />
            <nebulaShaderMaterial transparent depthWrite={false} />
        </mesh>
    );
}
