import { $, store } from "voby"
import { Game, Player } from "hide-and-squeak-server"

// export type Game = Awaited<ReturnType<typeof trpc.createGame.mutate>>

export type AppState = {
  currentGame: Game | null
  player: Player | null
}

export const appState = store<AppState>({
  currentGame: null,
  player: null,
})
