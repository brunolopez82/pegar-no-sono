/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportacao estatica: gera HTML puro em out/ — o que os crawlers de IA leem sem executar JS.
  output: 'export',
  images: { unoptimized: true },
  // /artigos/x/ -> /artigos/x/index.html. Evita 404 em Apache/Hostinger.
  trailingSlash: true,
};
export default nextConfig;
