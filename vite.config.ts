import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.SPOONACULAR_API_KEY;

  return {
    plugins: [react(), tailwindcss()],
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: [".ngrok-free.app", ".ngrok.io"],
      proxy: {
        '/api/spoonacular': {
          target: 'https://api.spoonacular.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/spoonacular/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // API Key를 서버에서 주입 → 클라이언트 번들에 노출되지 않음
              const [pathname, search] = proxyReq.path.split('?');
              const params = new URLSearchParams(search);
              params.set('apiKey', apiKey);
              proxyReq.path = `${pathname}?${params.toString()}`;
            });
          },
        },
      },
    },
  };
});
