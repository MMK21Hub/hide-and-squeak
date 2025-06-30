import { $ } from "voby"

function App(): JSX.Element {
  const count = $(0)
  const increment = () => count((value) => value + 1)

  return (
    <div>
      <header>
        <p>
          <button type="button" onClick={increment}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          href="https://github.com/vobyjs/voby"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Voby
        </a>
      </header>
    </div>
  )
}

export default App
