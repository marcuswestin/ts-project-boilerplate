import { useEffect, useState } from 'react'
import { apiClient } from 'shared/api/api-definition'

function App() {
  const [count, setCount] = useState(0)

  const [doubleInput, setDoubleInput] = useState(10)
  const [doubled, setDoubled] = useState(0)

  const [uppercaseInput, setUppercaseInput] = useState('Hello World!')
  const [uppercased, setUppercased] = useState('')

  useEffect(() => {
    async function pingAPI() {
      let doubledRes = await apiClient.double({ num: doubleInput })
      let uppercaseRes = await apiClient.upperCase({ text: uppercaseInput })
      setDoubled(doubledRes.doubled)
      setUppercased(uppercaseRes.upperCased)
    }
    pingAPI()
  }, [doubleInput, uppercaseInput])

  return (
    <div>
      <input
        type="text"
        value={uppercaseInput}
        onChange={(e) => {
          setUppercaseInput(e.target.value)
        }}
        autoFocus
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
  )
}

export default App
