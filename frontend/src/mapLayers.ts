import L from "leaflet"

export function OSMFTileServerLayer() {
  const layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>`,
  })
  return layer
}
