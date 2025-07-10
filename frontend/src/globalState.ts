import { $, store } from "voby"
import { trpc } from "./trpc"

export type Game = Awaited<ReturnType<typeof trpc.createGame.mutate>>

export type AppState = {
  currentGame: Game | null
}

export const appState = store<AppState>({
  currentGame: null,
})
