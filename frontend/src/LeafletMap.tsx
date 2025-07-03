import "leaflet/dist/leaflet.css"
import L, { Map, MapOptions } from "leaflet"
import { createDirective } from "voby"
import "./leafletCustom.css"
import "leaflet-draw"
import "leaflet-draw/dist/leaflet.draw.css"

const LeafletDirective = createDirective(
  "leaflet",
  (element: Element, options?: MapOptions, onMount?: (map: Map) => void) => {
    if (!(element instanceof HTMLElement))
      throw new Error("Leaflet directive can only be used on HTML elements")
    const map = L.map(element, options)
    onMount?.(map)
  }
)

function LeafletMap(
  props: {
    options?: MapOptions
    onMount?: (map: Map) => void
  } & JSX.HTMLAttributes<HTMLDivElement>
): JSX.Element {
  return (
    <LeafletDirective.Provider>
      <div use:leaflet={[props.options, props.onMount]} {...props}></div>
    </LeafletDirective.Provider>
  )
}

export default LeafletMap
