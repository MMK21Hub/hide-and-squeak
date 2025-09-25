import { Game } from "hide-and-squeak-server"

function CurrentGameScreen({ game }: { game: Game }): JSX.Element {
  return (
    <div class="flex flex-col gap-2 h-full m-4">
      <h1 class="text-3xl mb-2">
        You have joined <strong>{() => game.name}</strong>
      </h1>
      <p class="mb-6">
        Note: Most of this screen's content is a placeholder, and will be
        improved in the future. Enjoy the debug info, and check out the map view
        too!
      </p>
      <p class="">
        Game code: <strong>{game.code.toUpperCase()}</strong>
      </p>
      <p class="">
        Players:{" "}
        <strong>{game.players.map((player) => player.name).join(", ")}</strong>
      </p>
      <p class="">
        Game boundaries:{" "}
        <strong>
          {game.gameBounds.coordinates[0]
            .map((coord) => `(${coord[0]}, ${coord[1]})`)
            .join(", ")}
        </strong>
      </p>
      <p class="">
        Game ID: <strong>{game.id}</strong>
      </p>
      <p class="">
        Game active: <strong>{game.active ? "Yes" : "No"}</strong>
      </p>
    </div>
  )
}

export default CurrentGameScreen
