import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    host: true,
    // open: true,
  },

  // Alias para imports más limpios
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@components": fileURLToPath(
        new URL("./src/components", import.meta.url)
      ),
      "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@context": fileURLToPath(new URL("./src/context", import.meta.url)),
    },
  },

  // Configuración de build para producción
  build: {
    // Incrementar el límite de advertencia a 1MB
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y ReactDOM en su propio chunk
          vendor: ["react", "react-dom"],
          // Separar librerías de UI grandes
          ui: ["framer-motion", "lucide-react", "recharts"],
          // Separar utilidades de red
          network: ["axios", "socket.io-client"],
        },
      },
    },
  },
});
