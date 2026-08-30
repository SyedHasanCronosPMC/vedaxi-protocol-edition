import { LEVELS, type AttentionLevel, type ElasticState, type ElementId } from './types'
export function commitAttention(state: ElasticState, scores: Record<ElementId, number>): Record<ElementId, AttentionLevel> {
  return Object.fromEntries((Object.keys(state.elements) as ElementId[]).map((id) => {
    const score = scores[id]; let level: AttentionLevel = score >= .72 ? 'FOCUSED' : score >= .5 ? 'CONTEXT' : score >= .28 ? 'PERIPHERAL' : 'DRAWER'
    const pin = state.pins[id]; if (pin && LEVELS[level] < LEVELS[pin]) level = pin
    return [id, level]
  })) as Record<ElementId, AttentionLevel>
}
