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
  const bottomNavButtons = Object.fromEntries(
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
      <For values={Object.entries(bottomNavButtons)}>
        {([currentLabel, active]) => {
          const screen = screens.find(({ label }) => label === currentLabel)
          if (!screen) throw new Error(`No screen found for ${currentLabel}`)
          return <BottomBarButton active={active} screen={screen} />
        }}
      </For>
    </div>
  )
}

function BottomBarButton({
  active,
  screen,
}: {
  active: () => boolean
  screen: Screen
}) {
  return (
    <button class={() => (active() ? "dock-active" : "")}>
      {screen.icon}
      <span class="dock-label">{screen.label}</span>
    </button>
  )
}

export default BottomNavigation
