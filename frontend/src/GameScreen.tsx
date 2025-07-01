import { trpc } from "./trpc"

async function handleGameJoin(event: SubmitEvent) {
  event.preventDefault()
  const form = event.target as HTMLFormElement
  const code = new FormData(form).get("gameCode")
  const username = new FormData(form).get("username")
  if (typeof code !== "string" || typeof username !== "string")
    return console.error("Invalid form data")

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
      alert(error.message)
    })
}

function GameScreen(): JSX.Element {
  return (
    <div class="flex flex-col items-center justify-center align-centre h-full">
      <div>
        <h2 class="text-4xl text-primary font-bold pb-8">Join a game</h2>
        <form onSubmit={handleGameJoin}>
          <fieldset class="fieldset pb-4">
            <legend class="fieldset-legend">Enter a game code</legend>
            <input
              required
              type="text"
              class="input sm:w-md"
              name="gameCode"
              placeholder="8EGX"
            />
          </fieldset>
          <fieldset class="fieldset pb-8">
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
      </div>
    </div>
  )
}

export default GameScreen
