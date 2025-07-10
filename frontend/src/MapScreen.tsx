import L from "leaflet"
import { Game } from "hide-and-squeak-server"
import LeafletMap from "./LeafletMap"
import { OSMFTileServerLayer } from "./mapLayers"

function MapScreen({ game }: { game: Game }): JSX.Element {
  const gameBounds = L.geoJSON(game.gameBounds, {
    style: {
      color: "var(--color-error)",
      weight: 2,
      fillColor: "transparent",
    },
  })

  return (
    <>
      <LeafletMap
        onMount={(map) => {
          OSMFTileServerLayer().addTo(map)
          gameBounds.addTo(map)
          map.fitBounds(gameBounds.getBounds(), {
            padding: [20, 20],
            maxZoom: 18,
          })
        }}
        class="h-full w-full"
      />
    </>
  )
}

export default MapScreen
