import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext", // Modern JavaScript for smaller builds
    sourcemap: false, // Disable sourcemaps to reduce build time
    chunkSizeWarningLimit: 1000, // Increase limit for chunk size warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) {
              return "firebase"; // Separate Firebase into its own chunk
            }
            return "vendor"; // Other vendor libraries
          }
        },
      },
    },
  },
});
