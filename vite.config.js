import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    // visualizer({
    //   filename: "stats.html",
    //   open: true,
    // }),
  ],
  build: {
    target: "esnext",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@firebase")) {
              return "firebase";
            }
            if (id.includes("react")) {
              return "react";
            }
            if (id.includes("framer-motion")) {
              return "framer-motion";
            }
            if (id.includes("popmotion")) {
              return "popmotion";
            }
            if (id.includes("recharts")) {
              return "recharts";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
