import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const { siteMapRoutes } = require("./src/routes");
import Pages from "vite-plugin-pages";
import generateSitemap from "vite-plugin-pages-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages({
      dirs: "src/views",
      onRoutesGenerated: (fileroutes) => {
        console.log("Generating sitemap");
        generateSitemap({
          routes: siteMapRoutes,
          readable: true,
          hostname: "https://games.thecyclefrontier.wiki",
        });
        console.log("Sitemap generated");
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
