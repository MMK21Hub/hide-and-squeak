import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "hide-and-squeak-server"

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3010",
    }),
  ],
})
