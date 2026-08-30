import { deriveToolSurface } from './deriveToolSurface'
import { store } from './store'
import type { ElasticState } from './types'
export function undoLastAdaptation(): { state: ElasticState; surface: ReturnType<typeof deriveToolSurface> } {
  const previous = store.state.history.at(-1); if (!previous) return { state: store.state, surface: deriveToolSurface(store.state) }
  const restored: ElasticState = { ...store.state, attention: previous.attention, pins: previous.pins, intent: previous.intent, rationale: previous.rationale, history: store.state.history.slice(0, -1) }
  const surface = deriveToolSurface(restored); store.state = { ...restored, surface: { live: [...surface.eligible], revision: surface.revision }, events: [...restored.events, { type: 'human_override', detail: 'undo' }] }; return { state: store.state, surface }
}
