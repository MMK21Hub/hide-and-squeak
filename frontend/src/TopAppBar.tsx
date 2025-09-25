import { appState } from "./globalState"

function TopAppBar() {
  const APP_NAME = "Hide and Squeak"

  return (
    <header class="navbar bg-base-100 shadow-sm space-x-6">
      <h1 class="sr-only">{APP_NAME}</h1>
      <a class="btn btn-ghost text-xl">{APP_NAME}</a>
      <div>
        Current game:{" "}
        <span class="font-bold">{appState.currentGame?.name}</span>
      </div>
    </header>
  )
}

export default TopAppBar
