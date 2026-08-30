import { renderModel } from '../core/renderModel'
import type { AttentionLevel, ElasticState, Element } from '../core/types'

export type Zone = 'FOCUSED' | 'CONTEXT' | 'PERIPHERAL' | 'DRAWER'
export function zoneProjection(state: ElasticState): Record<Zone, Element[]> {
  const model = renderModel(state); const zones: Record<Zone, Element[]> = { FOCUSED: [], CONTEXT: [], PERIPHERAL: [], DRAWER: [] }
  for (const element of Object.values(state.elements)) zones[model[element.id].level].push(element)
  return zones
}
export function semanticRepresentation(element: Element, level: AttentionLevel): string[] {
  if (level === 'FOCUSED') return element.semantic.focused
  return [level === 'CONTEXT' ? element.semantic.candidate : element.semantic.peripheral]
}
