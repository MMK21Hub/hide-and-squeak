import { Polygon, Position } from "geojson"
import { TabButton, TabContent, Tabs } from "./tabs"
import { trpc } from "./trpc"
import BoundaryDrawer from "./BoundaryDrawer"
import { $, If, useMemo } from "voby"
import { appState } from "./globalState"

function GameScreen(): JSX.Element {
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
        appState.currentGame = response.game
      })
      .catch((error: Error) => {
        console.error(error)
        alert("Error: " + error.message)
      })
  }

  async function createGame(event: SubmitEvent) {
    event.preventDefault()
    const gameBounds = boundaryForNewGame()
    if (!gameBounds) return console.error("No game bounds given!")
    const form = event.target as HTMLFormElement
    const gameName = new FormData(form).get("gameName")
    if (typeof gameName !== "string")
      throw new Error("Username is not a string")
    const newGame = await trpc.createGame.mutate({
      name: gameName,
      gameBounds: {
        // We tell TypeScript that the polygon has at least 4 corners (which it must do to be valid)
        coordinates: gameBounds.coordinates as [
          Position,
          Position,
          Position,
          Position,
          ...Position[]
        ][],
        type: gameBounds.type,
      },
    })
    alert(
      `Created game successfully!\nYour game code is: ${newGame.code.toUpperCase()}`
    )
  }

  const boundaryForNewGame = $<Polygon>()
  const boundaryMissing = useMemo(() => !boundaryForNewGame())

  return (
    <div class="flex flex-col items-center py-8 justify-center flex-1">
      <div class="">
        <Tabs tabsName="game-screen" defaultTab="join-game">
          <div class="tabs tabs-box w-fit mx-auto mb-8">
            <TabButton for="join-game">Join game</TabButton>
            <TabButton for="create-game">Create game</TabButton>
          </div>
          <TabContent name="join-game">
            <h2 class="text-4xl text-primary font-bold mb-8">Join a game</h2>
            <p class="w-sm sm:w-md pb-4">
              Just want to test the app? Use the demo game code{" "}
              <code>4J1QH4</code>, or create your own game!
            </p>
            <form onSubmit={joinGame}>
              <fieldset class="fieldset mb-4">
                <legend class="fieldset-legend">Enter a game code</legend>
                <input
                  required
                  type="text"
                  class="input w-sm sm:w-md"
                  name="gameCode"
                  placeholder="8EG7XD"
                  autoCapitalize="characters"
                />
              </fieldset>
              <fieldset class="fieldset mb-8">
                <legend class="fieldset-legend">Pick a username</legend>
                <input
                  required
                  type="text"
                  class="input w-sm sm:w-md"
                  name="username"
                  placeholder="Username"
                />
              </fieldset>
              <button class="btn btn-primary">Join</button>
            </form>
          </TabContent>
          <TabContent name="create-game">
            <h2 class="text-4xl text-primary font-bold mb-8">Create game</h2>
            <form onSubmit={createGame}>
              <fieldset class="fieldset mb-8">
                <legend class="fieldset-legend">Game name</legend>
                <input
                  required
                  type="text"
                  class="input w-sm sm:w-md"
                  name="gameName"
                  placeholder="Game name"
                />
              </fieldset>
              <h3 class="text-2xl text-primary font-bold mb-8">
                Select game boundaries
              </h3>
              <BoundaryDrawer boundaryGeoJSON={boundaryForNewGame} />
              <div class="flex gap-4 items-center">
                <button class="btn btn-primary" disabled={boundaryMissing}>
                  Create game
                </button>
                <If when={boundaryMissing}>
                  <span>Select a boundary above before continuing</span>
                </If>
              </div>
            </form>
          </TabContent>
        </Tabs>
      </div>
    </div>
  )
}

export default GameScreen
