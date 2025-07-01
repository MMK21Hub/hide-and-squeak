import "./screens.css"
import { $, For, useEffect, useMemo } from "voby"

export interface Screen {
  label: string
  icon: JSX.Element | SVGElement
}

function BottomNavigation({ screens }: { screens: Screen[] }) {
  function handleClick(event: MouseEvent) {
    // Get the button element that was clicked on
    const eventTarget = event.target as HTMLElement
    const button = eventTarget.closest("button")
    if (!button) {
      throw new Error("Couldn't find button that was clicked on")
    }
    // Update the active screen to whichever screen our button corresponds to
    const screenName = button.textContent!
    activeScreen(screenName)
  }

  // Source of truth for the current active screen.
  const defaultScreen = screens[0]
  const activeScreen = $(defaultScreen.label)
  // A map of botton names to observables representing their active state
  const bottomBarButtons = Object.fromEntries(
    screens.map(({ label }) => [label, useMemo(() => activeScreen() === label)])
  )
  // e.g. appending #Route to the URL should set the default screen to the Route screen
  const screenFromHash = window.location.hash.slice(1)
  if (screenFromHash in screens) activeScreen(screenFromHash)

  useEffect(() => {
    // This is a handler function for when the active screen changes
    const newActiveScreen = activeScreen()

    // Make the new active screen visible and hide the old one
    const oldScreenElement = document.querySelector("#active-screen")
    const newScreenElement = document.querySelector(
      `[data-screen="${newActiveScreen.toLowerCase()}"]`
    )
    if (!newScreenElement) {
      throw new Error(`No screen found for ${newActiveScreen}`)
    }
    if (oldScreenElement) {
      oldScreenElement.id = ""
    } else {
      console.warn("No active screen to deactivate")
    }
    newScreenElement.id = "active-screen"
  })

  return (
    <div class="dock" onClick={handleClick}>
      <For values={Object.entries(bottomBarButtons)}>
        {([name, active]) => <BottomBarButton active={active} name={name} />}
      </For>
    </div>
  )
}

function BottomBarButton({
  active,
  name,
}: {
  active: () => boolean
  name: string
}) {
  return (
    <button class={() => (active() ? "dock-active" : "")}>
      <svg
        class="size-[1.2em]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
          <polyline
            points="1 11 12 2 23 11"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="2"
          ></polyline>
          <path
            d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
            fill="none"
            stroke="currentColor"
            stroke-linecap="square"
            stroke-miterlimit="10"
            stroke-width="2"
          ></path>
          <line
            x1="12"
            y1="22"
            x2="12"
            y2="18"
            fill="none"
            stroke="currentColor"
            stroke-linecap="square"
            stroke-miterlimit="10"
            stroke-width="2"
          ></line>
        </g>
      </svg>
      <span class="dock-label">{name}</span>
    </button>
  )
}

export default BottomNavigation
