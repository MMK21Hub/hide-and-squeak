import { $, store } from "voby"
import { Game } from "hide-and-squeak-server"

// export type Game = Awaited<ReturnType<typeof trpc.createGame.mutate>>

export type AppState = {
  currentGame: Game | null
}

export const appState = store<AppState>({
  currentGame: null,
})
