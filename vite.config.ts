import { defineConfig } from "vite";
import voby from "voby-vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    voby(),
    VitePWA({
      strategies: "injectManifest",
      registerType: "autoUpdate",
      injectRegister: "inline",
      srcDir: "./",
      filename: "sw.js",
      manifest: {
        name: "My Voby App",
        short_name: "Voby App",
        description: "My Super Fast Voby App",
        theme_color: "#FFF6DB",
        start_url: "/?source=pwa",
        icons: [
          {
            src: "/pwa-logos/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-logos/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-logos/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
