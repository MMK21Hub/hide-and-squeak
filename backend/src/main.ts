import { z } from "zod"
import { publicProcedure, router } from "./trpc"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import cors from "cors"
import { PrismaClient } from "../generated/prisma"
import { TRPCError } from "@trpc/server"

const prisma = new PrismaClient()

const appRouter = router({
  /** Returns any sort of "pong" response that demonstrates the API is functioning. */
  ping: publicProcedure.query(() => {
    return `Pong! The time is ${new Date().toISOString()}`
  }),
  joinGame: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(256),
        username: z.string().min(1).max(128),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts
      const matchedGame = await prisma.game.findUnique({
        where: { code: input.code },
        include: {
          players: true,
        },
      })
      if (!matchedGame)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Game with code "${input.code}" not found`,
        })
      if (!matchedGame.active)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Game is no longer active`,
        })
      const duplicatePlayer = matchedGame.players.find(
        (player) => player.name.toLowerCase() === input.username.toLowerCase()
      )
      if (duplicatePlayer)
        throw new TRPCError({
          code: "CONFLICT",
          message: `Player with username "${input.username}" already exists in the game`,
        })
      const newPlayer = await prisma.player.create({
        data: {
          name: input.username,
          gameId: matchedGame.id,
        },
      })
      return {
        player: newPlayer,
        game: matchedGame,
      }
    }),
})

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
})

const PORT = 3010

try {
  server.listen(PORT)
  console.log(`Server listening on port ${PORT}`)
} catch (error) {
  console.error(error)
} finally {
  prisma.$disconnect()
}

export type AppRouter = typeof appRouter
