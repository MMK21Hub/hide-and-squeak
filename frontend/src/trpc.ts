import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "hide-and-squeak-server"

const isDev =
  import.meta.env.DEV ||
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1"
const fallbackApiURL = isDev ? "http://localhost:3010/trpc" : null
const API_URL_ENV = "HIDE_AND_SQUEAK_API"
const apiURL: string | null =
  localStorage.getItem("api_url") ||
  import.meta.env[API_URL_ENV] ||
  fallbackApiURL

if (!apiURL) {
  throw new Error(
    `No API URL available. Ensure the ${API_URL_ENV} environment variable was correctly set when the frontend was built. See deployment instructions for details.`
  )
}

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiURL,
    }),
  ],
})
