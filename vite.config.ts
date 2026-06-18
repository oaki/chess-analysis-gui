import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      "process.env": JSON.stringify(env),
    },
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            chess: ["chess.js", "chessground"],
          },
        },
      },
    },
    resolve: {
      alias: {
        "socket.io-client": "socket.io-client",
      },
    },
  };
});
