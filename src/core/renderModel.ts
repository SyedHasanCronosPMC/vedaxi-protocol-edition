import type { ElasticState, AttentionLevel, ElementId } from './types'
export type RenderModel = Record<ElementId, { level: AttentionLevel; label: string; rationale?: string }>
export function renderModel(state: ElasticState): RenderModel { return Object.fromEntries(Object.values(state.elements).map((element) => [element.id, { level: state.attention[element.id], label: element.label, rationale: Object.values(state.rationale).find((r) => r.elementId === element.id)?.summary }])) as RenderModel }
