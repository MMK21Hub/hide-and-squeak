import { $ } from "voby"
import { trpc } from "./trpc"

export type Game = Awaited<ReturnType<typeof trpc.createGame.mutate>>

export const currentGame = $<Game | null>(null)
