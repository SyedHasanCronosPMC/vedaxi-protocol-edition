import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { applyIntent } from './core/applyIntent'
import { deriveToolSurface } from './core/deriveToolSurface'
import { initialState, store } from './core/store'
import type { ElasticState } from './core/types'
import { Zone } from './ui/Zone'
import { zoneProjection } from './ui/model'
import { clearProbeSurface, registerInitialProbeSurface, webMcpSupported } from './webmcpProbe'

const S1 = 'Help me understand the methodology in this paper'
const S2 = 'Compare the methodology with what the author says in the video'
function App() {
  const [state, setState] = useState<ElasticState>(store.state)
  const [intent, setIntent] = useState('')
  const [showCapabilities, setShowCapabilities] = useState(false)
  const [probeStatus, setProbeStatus] = useState('WebMCP probe unavailable')
  useEffect(() => { if (!webMcpSupported()) return; void registerInitialProbeSurface().then(() => setProbeStatus('G1 probe retained: A/B/C registered')).catch(() => setProbeStatus('G1 probe registration failed')); return clearProbeSurface }, [])
  const surface = deriveToolSurface(state); const zones = zoneProjection(state)
  function submit(value: string) { if (!value.trim()) { store.state = initialState(); setState(store.state); setIntent(''); return }; const result = applyIntent(value, [], 'human-ui'); setState(result.state); setIntent(value) }
  function onSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); submit(intent) }
  return <main>
    <header className="intent-bar"><div><p className="eyebrow">Elastic Web</p><h1>Research workspace</h1><p className="disclosure">Synthetic research fixture created for the WebMCP Challenge. No real study is depicted.</p></div><div className="capabilities"><button type="button" aria-expanded={showCapabilities} onClick={() => setShowCapabilities(!showCapabilities)}>{surface.eligible.size} capabilities active · r{state.surface.revision}</button>{showCapabilities && <ul aria-label="Agent capability surface">{[...surface.eligible].map((tool) => <li key={tool}>{tool}</li>)}</ul>}</div><form onSubmit={onSubmit}><label htmlFor="intent">What are you trying to do?</label><input id="intent" value={intent} onChange={(event) => setIntent(event.target.value)} placeholder="Help me understand the methodology…" /><button type="submit">Set intent</button></form><div className="presets"><button type="button" onClick={() => submit(S1)}>Understand methodology</button><button type="button" onClick={() => submit(S2)}>Compare paper and video</button><button type="button" onClick={() => submit('')}>Reset</button></div></header>
    <section className="workspace" aria-live="polite"><Zone title="Focal Plane" state={state} ids={zones.FOCUSED.map((e) => e.id)} /><Zone title="Context Ring" state={state} ids={zones.CONTEXT.map((e) => e.id)} /><Zone title="Peripheral Belt" state={state} ids={zones.PERIPHERAL.map((e) => e.id)} /><aside className="drawer" aria-label="App Drawer"><Zone title="App Drawer" state={state} ids={zones.DRAWER.map((e) => e.id)} /><p>Outside current focus · preserved and restore-ready</p></aside></section>
    <footer>{probeStatus}</footer>
  </main>
}
export default App
