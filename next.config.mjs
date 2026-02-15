/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Unsplash images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Transpile Three.js packages for proper ESM support
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],

  // Empty turbopack config to silence the Turbopack warning
  turbopack: {},
};

export default nextConfig;
