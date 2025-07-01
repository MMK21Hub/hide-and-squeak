import { z } from "zod"
import { publicProcedure, router } from "./trpc"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import cors from "cors"

const validLongitude = z.number().gte(-180).lte(180)
const validLatitude = z.number().gte(-90).lte(90)

const appRouter = router({
  ping: publicProcedure.query(() => {
    return `Pong! The time is ${new Date().toISOString()}`
  }),
  putCoordinates: publicProcedure
    .input(z.tuple([validLatitude, validLongitude]))
    .mutation(async (opts) => {
      const { input } = opts
      return `Coordinates are (${input[0]}, ${input[1]})`
    }),
})

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
})

const PORT = 3010
server.listen(PORT)
console.log(`Server listening on port ${PORT}`)

export type AppRouter = typeof appRouter
