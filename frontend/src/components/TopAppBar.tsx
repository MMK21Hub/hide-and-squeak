function TopAppBar() {
  const APP_NAME = "Hide and Squeak"

  return (
    <header class="navbar bg-base-100 shadow-sm">
      <h1 class="sr-only">{APP_NAME}</h1>
      <a class="btn btn-ghost text-xl">{APP_NAME}</a>
    </header>
  )
}

export default TopAppBar
