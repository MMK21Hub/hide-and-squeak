import "leaflet/dist/leaflet.css"
import L, { Map, MapOptions } from "leaflet"
import { createDirective, Observable } from "voby"

const LeafletDirective = createDirective(
  "leaflet",
  (element: Element, options?: MapOptions, onMount?: (map: Map) => void) => {
    if (!(element instanceof HTMLElement))
      throw new Error("Leaflet directive can only be used on HTML elements")
    const map = L.map(element, options)
    onMount?.(map)
  }
)

function LeafletMap(props: JSX.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <LeafletDirective.Provider>
      <div use:leaflet {...props}></div>
    </LeafletDirective.Provider>
  )
}

export default LeafletMap
