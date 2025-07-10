import { z } from "zod/v4"
import { publicProcedure, router } from "./trpc.js"
import cors from "cors"
import { PrismaClient } from "../generated/prisma/index.js"
import { TRPCError } from "@trpc/server"
import { GeoJSONPolygonSchema } from "zod-geojson"
import { createId as cuid } from "@paralleldrive/cuid2"
import { generateRandomId } from "./util.js"
import { createExpressMiddleware } from "@trpc/server/adapters/express"
import express from "express"
import { join as joinPath } from "node:path"
import { stat } from "node:fs/promises"

const prisma = new PrismaClient()

export interface Player {
  id: string
  name: string
  gameId: string
}

export interface Game {
  id: string
  code: string
  name: string
  gameBounds: z.infer<typeof GeoJSONPolygonSchema>
  active: boolean
  players: Player[]
}

async function getGameBounds(gameId: string) {
  const gameBoundsQuery = await prisma.$queryRaw<{ gameBounds: string }[]>`
        SELECT ST_AsGeoJSON("gameBounds") AS "gameBounds"
        FROM "Game"
        WHERE "id" = ${gameId}
      `
  try {
    const gameBounds = GeoJSONPolygonSchema.parse(
      JSON.parse(gameBoundsQuery[0].gameBounds)
    )
    return gameBounds
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Game bounds were not in the expected format: ${error}`,
    })
  }
}

const appRouter = router({
  /** Returns any sort of "pong" response that demonstrates the API is functioning. */
  ping: publicProcedure.query(() => {
    return `Pong! The time is ${new Date().toISOString()}`
  }),
  createGame: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(128),
        gameBounds: GeoJSONPolygonSchema,
      })
    )
    .mutation<Game>(async ({ input }) => {
      const gameCode = generateRandomId(6)
      const geoJSON = JSON.stringify(input.gameBounds)
      await prisma.$executeRaw`
        INSERT INTO "Game" ("id", "code", "name", "gameBounds")
        VALUES (${cuid()}, ${gameCode}, ${
        input.name
      }, ST_SetSRID(ST_GeomFromGeoJSON(${geoJSON}), 3857))
      `
      const addedGame = await prisma.game.findUnique({
        where: { code: gameCode },
        include: {
          players: true,
        },
      })
      if (!addedGame)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add game to database",
        })
      return {
        gameBounds: input.gameBounds,
        ...addedGame,
      }
    }),
  joinGame: publicProcedure
    .input(
      z.object({
        code: z.string().min(1).max(256),
        username: z.string().min(1).max(128),
      })
    )
    .mutation<{
      player: Player
      game: Game
    }>(async (opts) => {
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
      // We have to get the game bounds separately because polygons are unsupported by Prisma
      const gameBounds = await getGameBounds(matchedGame.id)
      return {
        player: newPlayer,
        game: {
          gameBounds,
          ...matchedGame,
        },
      }
    }),
})

const app = express()
app.use(cors())

// Set up tRPC API
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
)

// Serve the frontend
const frontendDist = joinPath(
  import.meta.dirname,
  "..",
  "..",
  "frontend",
  "dist"
)
const frontendDistError = await stat(frontendDist)
  .then(() => null)
  .catch((error) => error)

if (!frontendDistError) {
  app.use(express.static(frontendDist))
  console.log(`Serving frontend from ${frontendDist}`)
} else {
  console.warn(
    "Warning: Not serving the frontend because the dist directory is not present."
  )
  console.warn(`${frontendDistError}`)
}

const PORT = 3010

try {
  app.listen(PORT)
  console.log(`Server listening on port ${PORT}`)
} catch (error) {
  console.error(error)
} finally {
  prisma.$disconnect()
}

export type AppRouter = typeof appRouter
