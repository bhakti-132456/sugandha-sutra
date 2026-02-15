/**
 * Sugandha Sutra — GLSL Glow Shader Material
 * Custom fragment shader that pulses glow based on audio amplitude.
 */

import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// Vertex shader — pass UVs and normals to fragment
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader — emissive glow pulsing with u_intensity (audio envelope)
const fragmentShader = `
  uniform float u_time;
  uniform float u_intensity;
  uniform vec3 u_glowColor;
  uniform vec3 u_baseColor;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    // Fresnel rim glow — brighter at edges
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);

    // Breathing pulse synced to audio
    float pulse = u_intensity * 0.8 + 0.2;

    // Combine base color with glow
    vec3 baseWithGlow = mix(u_baseColor, u_glowColor, fresnel * pulse);

    // Subtle time-based shimmer
    float shimmer = sin(u_time * 1.5 + vUv.x * 6.28) * 0.05 + 0.95;

    // Emissive bloom factor
    float bloom = fresnel * pulse * 1.5;

    // Final color with HDR-like glow
    vec3 finalColor = baseWithGlow * shimmer + u_glowColor * bloom * 0.3;

    // Alpha with edge glow
    float alpha = 0.6 + fresnel * pulse * 0.4;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Create the shader material using drei's shaderMaterial helper
const SacredGlowMaterial = shaderMaterial(
    {
        u_time: 0,
        u_intensity: 0.5,
        u_glowColor: [0.886, 0.651, 0.196], // Turmeric Gold in RGB
        u_baseColor: [0.08, 0.08, 0.1],     // Deep grey
    },
    vertexShader,
    fragmentShader
);

// Extend R3F so we can use <sacredGlowMaterial /> in JSX
extend({ SacredGlowMaterial });

export { SacredGlowMaterial };
export default SacredGlowMaterial;
