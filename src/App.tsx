import { useEffect, useState } from 'react'
import './App.css'
import {
  clearProbeSurface,
  currentProbeSurface,
  registerInitialProbeSurface,
  swapProbeSurface,
  webMcpSupported,
} from './webmcpProbe'

function App() {
  const [supported] = useState(webMcpSupported)
  const [surface, setSurface] = useState(currentProbeSurface)
  const [message, setMessage] = useState('Preparing the G1 probe surface…')

  useEffect(() => {
    if (!supported) {
      setMessage('WebMCP is unavailable in this browser. The page remains usable.')
      return
    }

    void registerInitialProbeSurface()
      .then((registered) => {
        setSurface(registered)
        setMessage('Initial surface registered. Ask the agent to discover and execute probe A.')
      })
      .catch((error: unknown) => {
        setMessage(`Registration failed: ${error instanceof Error ? error.message : String(error)}`)
      })

    return clearProbeSurface
  }, [supported])

  async function handleSwap() {
    try {
      const nextSurface = await swapProbeSurface()
      setSurface(nextSurface)
      setMessage('B and C were removed; D was added. Ask the agent to observe the surface again without reloading.')
    } catch (error: unknown) {
      setMessage(`Surface swap failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <main>
      <p className="eyebrow">Elastic Web · G1 environment probe</p>
      <h1>WebMCP registration spike</h1>
      <p className="summary">This temporary probe verifies real tool registration, execution, and dynamic observation before any product UI is built.</p>
      <dl>
        <div><dt>WebMCP support</dt><dd>{supported ? 'Detected' : 'Not detected'}</dd></div>
        <div><dt>Registered surface</dt><dd>{surface.length ? surface.map((name) => name.toUpperCase()).join(' + ') : 'None'}</dd></div>
      </dl>
      <p className="status" role="status">{message}</p>
      <button type="button" disabled={!supported} onClick={handleSwap}>Run A/B/C → A/D swap</button>
      <ol>
        <li>Ask the ChatGPT agent to list and execute probe A.</li>
        <li>Click the swap above; it aborts B and C and registers D.</li>
        <li>Without reloading, ask the agent which probes it now observes.</li>
      </ol>
    </main>
  )
}

export default App
