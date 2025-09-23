import L, { LatLng, LatLngExpression } from "leaflet"
import { Game } from "hide-and-squeak-server"
import * as geojson from "geojson"
import LeafletMap from "../../components/LeafletMap"
import { OSMFTileServerLayer } from "../../mapLayers"
import { LocateControl } from "leaflet.locatecontrol"
import { iconViewfinderCircle } from "../../components/heroIcons"
import { $ } from "voby"


function disallowedAreaPolygon(
  allowedArea: L.GeoJSON<any, geojson.Polygon>
): L.Polygon {
  const everywhere: LatLngExpression[] = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
  ]
  const allowedPolygon = allowedArea.getLayers()[0]
  if (!(allowedPolygon instanceof L.Polygon))
    throw new Error("Expected a Leaflet polygon instance")
  const allowed = allowedPolygon.getLatLngs() as [LatLngExpression[]]
  if (!("lat" in allowed[0][0])) {
    console.error("Unexpected type:", allowed)
    throw new Error("Expected a single polygon! Check console errors.")
  }
  // Create a polygon encompassing the whole world, with the allowed area as a hole
  const disallowedArea = L.polygon([everywhere, allowed[0]])
  return disallowedArea
}

function MapScreen({ game }: { game: Game }): JSX.Element {
  function zoomToBounds() {
    try {
      const map = theMap()
      if (!map)
        return console.warn("Map not ready yet, skipping zoom operation")
      const bounds = gameBounds.getBounds()
      console.log("Zooming to game bounds:", bounds)
      map.fitBounds(bounds, {
        padding: [10, 10],
        maxZoom: 18,
      })
    } catch (error) {
      debugger
    }
  }

  const theMap = $<L.Map>()

  const gameBounds = L.geoJSON<any, geojson.Polygon>(game.gameBounds, {
    style: {
      color: "var(--color-error)",
      weight: 2,
      fillColor: "transparent",
    },
  })

  const disallowedArea = disallowedAreaPolygon(gameBounds).setStyle({
    color: "transparent",
    fillColor: "var(--color-error)",
    fillOpacity: 0.2,
  })

  const locateControl = new LocateControl({
    strings: {
      title: "Show location on map",
    },
    locateOptions: {
      enableHighAccuracy: true,
    },
    // Prevent the default alert() that gets shown on location error
    onLocationError: () => void 0,
  })

  return (
    <>
      <LeafletMap
        onMount={(map) => {
          theMap(map)
          OSMFTileServerLayer().addTo(map)
          gameBounds.addTo(map)
          map.setView([51, 0], 10)
          disallowedArea.addTo(map)

          locateControl.addTo(map)
          locateControl.start()
        }}
        class="h-full w-full"
      />
      <div
        class="fab absolute z-[10000] bottom-25 right-5 tooltip tooltip-left"
        data-tip="Zoom to game area"
      >
        <button
          class="btn btn-lg btn-circle btn-primary"
          onClick={zoomToBounds}
        >
          {iconViewfinderCircle}
        </button>
      </div>
    </>
  )
}

export default MapScreen
