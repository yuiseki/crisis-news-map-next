/** @type {import('next').NextConfig} */
const nextConfig = {
  // OpenNext's build traces which node_modules files Next.js's own (Node)
  // build actually touched and only copies those into the bundle staging
  // dir. The @emotion packages ship separate dist files behind an
  // "edge-light"/"workerd" conditional export that the Node build never
  // resolves, so those files get pruned - then wrangler's own esbuild pass
  // (which *does* apply the "workerd" condition) fails to find them.
  // Leaving them external skips the trace/prune step for these packages.
  serverExternalPackages: [
    '@emotion/react',
    '@emotion/css',
    '@emotion/cache',
    '@emotion/utils',
    '@emotion/styled',
    '@emotion/server',
    '@emotion/use-insertion-effect-with-fallbacks',
    '@emotion/serialize',
    '@emotion/weak-memoize',
  ],
};

export default nextConfig;
