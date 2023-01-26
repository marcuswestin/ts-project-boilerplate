import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { apiClient } from 'shared/api/api-definition'

function App() {
  const [count, setCount] = useState(0)

  const [doubleInput, setDoubleInput] = useState(10)
  const [doubled, setDoubled] = useState(0)

  const [uppercaseInput, setUppercaseInput] = useState('Hello World!')
  const [uppercased, setUppercased] = useState('')

  useEffect(() => {
    async function pingAPI() {
      setDoubled(await (await apiClient.double({ num: doubleInput })).doubled)
      setUppercased(await (await apiClient.upperCase({ text: uppercaseInput })).upperCased)
    }
    pingAPI()
  }, [doubleInput, uppercaseInput])

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={uppercaseInput}
          onChange={(e) => {
            setUppercaseInput(e.target.value)
          }}
        />
        <h2>Uppercased: {uppercased}</h2>
        <input
          type="text"
          value={doubleInput}
          onChange={(e) => {
            setDoubleInput(parseInt(e.target.value || '0') || 0)
          }}
        />
        <h2>Doubled: {doubled}</h2>
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  )
}

export default App
