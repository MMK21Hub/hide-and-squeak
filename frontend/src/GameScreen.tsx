import { trpc } from "./trpc"

async function handleGameJoin(event: SubmitEvent) {
  event.preventDefault()
  const form = event.target as HTMLFormElement
  const gameCode = new FormData(form).get("gameCode")
  const ping = await trpc.ping.query()
  alert(
    `\
Game code: "${gameCode}"
API ping response: ${ping}
`
  )
}

function GameScreen(): JSX.Element {
  return (
    <div class="flex flex-col items-center justify-center align-centre h-full">
      <div>
        <h2 class="text-4xl text-primary font-bold pb-8">Join a game</h2>
        <form onSubmit={handleGameJoin}>
          <fieldset class="fieldset pb-8">
            <legend class="fieldset-legend">Enter a game code</legend>
            <input
              required
              type="text"
              class="input sm:w-md"
              name="gameCode"
              placeholder="8EGX"
            />
          </fieldset>
          <button class="btn btn-primary">Join</button>
        </form>
      </div>
    </div>
  )
}

export default GameScreen
