import { Game } from "./globalState"
import LeafletMap from "./LeafletMap"
import { OSMFTileServerLayer } from "./mapLayers"

function MapScreen({ game }: { game: Game }): JSX.Element {
  return (
    <>
      <LeafletMap
        onMount={(map) => {
          map.setView([51, 0], 10)
          OSMFTileServerLayer().addTo(map)
        }}
        class="h-full w-full"
      />
    </>
  )
}

export default MapScreen
