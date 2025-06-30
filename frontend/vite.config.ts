import { defineConfig } from "vite"
import voby from "voby-vite"
import { VitePWA } from "vite-plugin-pwa"

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
        name: "Hide and Squeak",
        short_name: "Hide and Squeak",
        description: "Run your own large-scale IRL hide and seek game",
        // theme_color: "#FFF6DB", TODO
        start_url: "/?source=pwa",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
})
