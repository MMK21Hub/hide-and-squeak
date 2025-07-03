import LeafletMap from "./LeafletMap"
import { OSMFTileServerLayer } from "./mapLayers"
import { TabButton, TabContent, Tabs } from "./tabs"
import { trpc } from "./trpc"

async function joinGame(event: SubmitEvent) {
  event.preventDefault()
  const form = event.target as HTMLFormElement
  const code = new FormData(form).get("gameCode")
  const username = new FormData(form).get("username")
  if (typeof code !== "string" || typeof username !== "string")
    throw new Error("Invalid form data")

  trpc.joinGame
    .mutate({
      code,
      username,
    })
    .then((response) => {
      alert(`Joined game ${response.game.code}!
Existing players: ${response.game.players.map((p) => p.name).join(", ")}`)
    })
    .catch((error: Error) => {
      console.error(error)
      alert("Error: " + error.message)
    })
}

async function createGame(event: SubmitEvent) {
  event.preventDefault()
  const form = event.target as HTMLFormElement
  const gameName = new FormData(form).get("gameName")
  const username = new FormData(form).get("username")
  if (typeof gameName !== "string" || typeof username !== "string")
    throw new Error("Invalid form data")
  // trpc.createGame.mutate({
  //   name: gameName,
  //   gameBounds: "",
  // })
}

function GameScreen(): JSX.Element {
  return (
    <div class="flex flex-col items-center py-8 justify-center flex-1">
      <div class="">
        <Tabs tabsName="game-screen" defaultTab="join-game">
          <div class="tabs tabs-box w-fit mx-auto mb-8">
            <TabButton for="join-game">Join Game</TabButton>
            <TabButton for="create-game">Create Game</TabButton>
          </div>
          <TabContent name="join-game">
            <h2 class="text-4xl text-primary font-bold mb-8">Join a game</h2>
            <form onSubmit={joinGame}>
              <fieldset class="fieldset mb-4">
                <legend class="fieldset-legend">Enter a game code</legend>
                <input
                  required
                  type="text"
                  class="input sm:w-md"
                  name="gameCode"
                  placeholder="8EGX"
                />
              </fieldset>
              <fieldset class="fieldset mb-8">
                <legend class="fieldset-legend">Pick a username</legend>
                <input
                  required
                  type="text"
                  class="input sm:w-md"
                  name="username"
                  placeholder="Username"
                />
              </fieldset>
              <button class="btn btn-primary">Join</button>
            </form>
          </TabContent>
          <TabContent name="create-game">
            <h2 class="text-4xl text-primary font-bold mb-8">Create game</h2>
            <form onSubmit={joinGame}>
              <fieldset class="fieldset mb-8">
                <legend class="fieldset-legend">Game name</legend>
                <input
                  required
                  type="text"
                  class="input sm:w-md"
                  name="gameName"
                  placeholder="Game name"
                />
              </fieldset>
              <h3 class="text-2xl text-primary font-bold mb-8">
                Select game boundaries
              </h3>
              <LeafletMap
                class="h-[min(70vh,60rem)] w-[70vw] mb-8 rounded-lg"
                onMount={(map) => {
                  map.setView([51, 0], 10)
                  const tiles = OSMFTileServerLayer()
                  console.log(tiles)
                  tiles.addTo(map)
                }}
              />
              <button class="btn btn-primary">??</button>
            </form>
          </TabContent>
        </Tabs>
      </div>
    </div>
  )
}

export default GameScreen
