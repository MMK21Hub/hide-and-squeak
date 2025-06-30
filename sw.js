import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

import { googleFontsCache, imageCache, pageCache } from "workbox-recipes";

pageCache();
googleFontsCache();
imageCache();

// registerRoute(
//   new RegExp("https://my-voby-app.com/.*\\.(ttf|woff|woff2)"),
//   new CacheFirst({ cacheName: "fonts" })
// );

precacheAndRoute(self.__WB_MANIFEST);
