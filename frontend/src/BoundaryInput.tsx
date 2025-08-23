import { Polygon as GeoJSONPolygon } from "geojson"
import { $, Observable } from "voby"
import Modal from "./Modal"

function BoundaryInput(props: {
  boundaryGeoJSON:
    | Observable<GeoJSONPolygon>
    | Observable<GeoJSONPolygon | undefined>
}): JSX.Element {
  const drawModalOpen = $(false)
  const importModalOpen = $(false)
  const boundary = props.boundaryGeoJSON
  return (
    <>
      <div
        class={[
          "alert alert-soft",
          boundary() ? "alert-info" : "alert-warning",
        ]}
      >
        <span>
          {() =>
            boundary() ? (
              <strong>✅ Boundary has been selected</strong>
            ) : (
              "No boundary selected yet"
            )
          }
        </span>
      </div>
      <div class="flex gap-4 flex-wrap mt-2">
        <button class="btn" type="button" onClick={() => drawModalOpen(true)}>
          Draw boundary on a map
        </button>
        <button class="btn" type="button" onClick={() => importModalOpen(true)}>
          Import GeoJSON
        </button>
      </div>
      <Modal id="draw-boundary-modal" show={drawModalOpen}>
        DRAW!
      </Modal>
      <Modal id="import-boundary-modal" show={importModalOpen}>
        IMPORT!
      </Modal>
    </>
  )
}

export default BoundaryInput
