import BottomNavigation from "./BottomNavigation"

function App(): JSX.Element {
  return (
    <>
      <h1 class="sr-only">Marvellous mapping machine</h1>
      <div class="content flex flex-col h-full justify-between">
        <div id="screens" class="overflow-y-auto">
          <div class="screen" data-screen="game" id="active-screen">
            AAAA
          </div>
          <div class="screen" data-screen="map">
            BBB
          </div>
        </div>
        <BottomNavigation screens={["game", "map"]} />
      </div>
    </>
  )
}

export default App
