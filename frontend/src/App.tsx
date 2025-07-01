import BottomNavigation from "./BottomNavigation"
import GameScreen from "./GameScreen"
import { iconMap, iconUserGroup } from "./heroIcons"
import TopAppBar from "./TopAppBar"

function App(): JSX.Element {
  return (
    <>
      <div class="content flex flex-col h-full">
        <TopAppBar />
        <div id="screens" class="overflow-y-auto h-full pb-[4rem]">
          <div class="screen" data-screen="game" id="active-screen">
            <GameScreen />
          </div>
          <div class="screen" data-screen="map">
            BBB
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
