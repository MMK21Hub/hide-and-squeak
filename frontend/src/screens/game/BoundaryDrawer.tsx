import L from "leaflet"
import { Polygon as GeoJSONPolygon } from "geojson"
import LeafletMap from "../../components/LeafletMap"
import { OSMFTileServerLayer } from "../../mapLayers"
import { $, Observable, useEffect } from "voby"

function BoundaryDrawer(props: {
  boundaryGeoJSON:
    | Observable<GeoJSONPolygon>
    | Observable<GeoJSONPolygon | undefined>
}): JSX.Element {
  const mapElement = $<HTMLElement>()
  const drawnItems = new L.FeatureGroup()
  const currentPolygon = $<L.Polygon>()
  useEffect(() => {
    const gameBoundary = currentPolygon()
    if (!gameBoundary) return
    const geoJSONPolygon = gameBoundary.toGeoJSON().geometry
    if (geoJSONPolygon.type !== "Polygon")
      return console.warn("Expected a polygon geometry", geoJSONPolygon)
    props.boundaryGeoJSON(geoJSONPolygon)
  })

  function clickLeafletButton(selector: string) {
    const button = mapElement()?.querySelector<HTMLAnchorElement>(selector)
    if (!button) {
      console.error(`Failed to find ${selector} button on map`)
      return
    }
    button.click()
  }

  return (
    <>
      <div class="flex gap-4 flex-wrap mb-4">
        <button
          type="button"
          class="btn btn-accent"
          onClick={() => clickLeafletButton(".leaflet-draw-draw-polygon")}
          disabled={() => !!currentPolygon()}
        >
          Draw area
        </button>
        <button
          type="button"
          class="btn"
          onClick={() => clickLeafletButton(".leaflet-draw-edit-edit")}
          disabled={() => !currentPolygon()}
        >
          Edit area
        </button>
        <button
          type="button"
          class="btn btn-error"
          onClick={() => {
            const polygonToRemove = currentPolygon()
            if (!polygonToRemove) return
            drawnItems.removeLayer(polygonToRemove)
            currentPolygon(undefined)
          }}
          disabled={() => !currentPolygon()}
        >
          Delete area
        </button>
      </div>
      <LeafletMap
        class="h-[min(70vh,60rem)] w-[90vw] sm:w-[70vw] mb-8 rounded-lg"
        onMount={(map) => {
          map.setView([51, 0], 10)
          OSMFTileServerLayer().addTo(map)
          map.addLayer(drawnItems)
          const drawControl = new L.Control.Draw({
            edit: {
              featureGroup: drawnItems,
              remove: false,
            },
            draw: {
              circle: false,
              marker: false,
              polyline: false,
              rectangle: false,
              circlemarker: false,
            },
          })
          map.addControl(drawControl)
          map.on(L.Draw.Event.CREATED, (event) => {
            const newPolygon = event.layer
            if (!(newPolygon instanceof L.Polygon))
              return console.warn("Drawn layer is not a polygon")
            const oldPolygon = currentPolygon()
            if (oldPolygon) drawnItems.removeLayer(oldPolygon)
            drawnItems.addLayer(newPolygon)
            currentPolygon(newPolygon)
          })
          mapElement(map.getContainer())
        }}
      />
    </>
  )
}

export default BoundaryDrawer
