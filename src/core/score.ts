import type { ElasticState, ElementId } from './types'
export function scoreAll(state: ElasticState, intent: string): Record<ElementId, number> {
  const lower = intent.toLowerCase()
  return Object.fromEntries(Object.values(state.elements).map((element) => {
    const hits = element.aliases.filter((alias) => lower.includes(alias)).length
    const explicitIntentMatch = hits ? Math.min(1, .5 + .25 * hits) * element.weight : 0
    const relevance = .4 * explicitIntentMatch + .15 * .5 + .1 * .5
    return [element.id, relevance - .15 * element.interfaceCost - .2 * .05]
  })) as Record<ElementId, number>
}
