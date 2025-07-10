import BottomNavigation from "./BottomNavigation"
import GameScreen from "./GameScreen"
import { appState } from "./globalState"
import { iconMap, iconUserGroup } from "./heroIcons"
import MapScreen from "./MapScreen"
import TopAppBar from "./TopAppBar"

function App(): JSX.Element {
  return (
    <>
      <div class="content flex flex-col h-full">
        <TopAppBar />
        <div id="screens" class="overflow-y-auto h-full mb-[4rem]">
          <div class="screen @container" data-screen="game" id="active-screen">
            <GameScreen />
          </div>
          <div class="screen" data-screen="map">
            {() => {
              const game = appState.currentGame
              return game ? (
                <MapScreen game={game} />
              ) : (
                <div class="flex flex-col gap-2 items-center justify-center h-full">
                  <h1 class="text-2xl font-bold">You're not in a game yet</h1>
                  <p class="">
                    The map will be available once you join a game.
                  </p>
                </div>
              )
            }}
          </div>
        </div>
        <BottomNavigation
          screens={[
            {
              label: "Game",
              icon: iconUserGroup,
            },
            {
              label: "Map",
              icon: iconMap,
            },
          ]}
        />
      </div>
    </>
  )
}

export default App
