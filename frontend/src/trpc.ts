import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "hide-and-squeak-server"

const API_URL_ENV = "HIDE_AND_SQUEAK_API"
const apiURL: string =
  localStorage.getItem("api_url") || import.meta.env[API_URL_ENV] || "/trpc"

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiURL,
    }),
  ],
})
