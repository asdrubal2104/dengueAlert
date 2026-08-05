/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['lucide-react'],
  webpack: (config) => {
    // Evita advertencias de deshacer/corrupción de caché de paquetes Webpack (ENOENT / PackFileCacheStrategy)
    // causados por symlinks de pnpm en entoronos de desarrollo o compilación.
    if (config.cache && typeof config.cache === 'object') {
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
