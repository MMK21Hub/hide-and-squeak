import L, { LatLng, LatLngExpression } from "leaflet"
import { Game } from "hide-and-squeak-server"
import * as geojson from "geojson"
import LeafletMap from "./LeafletMap"
import { OSMFTileServerLayer } from "./mapLayers"

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

  return (
    <>
      <LeafletMap
        onMount={(map) => {
          OSMFTileServerLayer().addTo(map)
          gameBounds.addTo(map)
          map.setView([51, 0], 10)
          disallowedArea.addTo(map)
          try {
            const bounds = gameBounds.getBounds()
            console.log("Zooming to game bounds:", bounds)
            map.fitBounds(bounds, {
              padding: [10, 10],
              maxZoom: 18,
            })
          } catch (error) {
            debugger
          }
        }}
        class="h-full w-full"
      />
    </>
  )
}

export default MapScreen
