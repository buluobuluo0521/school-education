import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // 修改这里，使用path.dirname

console.log('__filename, __dirname :',__filename,__dirname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@types': path.resolve(__dirname, 'types')
    };
    return config;
  }
}

export default nextConfig;