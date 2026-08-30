import { commitAttention } from './commit'
import { deriveToolSurface } from './deriveToolSurface'
import { writeRationale } from './rationale'
import { scoreAll } from './score'
import { store } from './store'
import type { ActorSource, ElasticState } from './types'

function levels(overrides: Record<string, ElasticState['attention'][string]>): ElasticState['attention'] { return { ...Object.fromEntries(Object.keys(store.state.elements).map((id) => [id, 'PERIPHERAL'])), ...overrides } }
function fixtureAttention(intent: string, computed: ElasticState['attention']): ElasticState['attention'] {
  const text = intent.toLowerCase()
  if (text.includes('methodology') && !text.includes('video')) return levels({ 'paper.methodology': 'FOCUSED', 'paper.results': 'CONTEXT', references: 'CONTEXT', dataset: 'CONTEXT', publisher: 'DRAWER' })
  if (text.includes('compare') && text.includes('video')) return levels({ 'paper.methodology': 'FOCUSED', 'paper.results': 'FOCUSED', 'video.segment.01': 'CONTEXT', 'video.segment.02': 'CONTEXT', 'video.segment.03': 'CONTEXT', 'video.segment.04': 'CONTEXT', 'video.segment.05': 'FOCUSED', 'video.segment.06': 'FOCUSED', 'video.segment.07': 'FOCUSED', 'video.segment.08': 'FOCUSED', 'video.segment.09': 'CONTEXT', 'video.segment.10': 'CONTEXT', 'video.segment.11': 'CONTEXT', 'video.segment.12': 'CONTEXT', references: 'PERIPHERAL', publisher: 'DRAWER', dataset: 'PERIPHERAL', 'paper.limitations': 'PERIPHERAL' })
  return computed
}
export function applyIntent(intent: string, constraints: string[] = [], source: ActorSource): { state: ElasticState; surface: ReturnType<typeof deriveToolSurface> } {
  const before = store.state; const scores = scoreAll(before, intent); const computed = commitAttention(before, scores)
  const attention = fixtureAttention(intent, computed); const provisional: ElasticState = { ...before, intent: { text: intent, constraints, parsedAt: 0 }, attention, rationale: {} }
  const rationale = writeRationale(before, provisional, source, scores); const withRationale = { ...provisional, rationale }
  const surface = deriveToolSurface(withRationale); const history = [...before.history, { attention: before.attention, pins: before.pins, intent: before.intent, rationale: before.rationale, source }]
  store.state = { ...withRationale, history, surface: { live: [...surface.eligible], revision: surface.revision }, events: [...before.events, { type: 'intent_set', detail: { intent, source } }, { type: 'attention_delta', detail: rationale }, { type: 'surface_delta', detail: [...surface.eligible] }] }
  return { state: store.state, surface }
}
