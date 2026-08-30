import { LEVELS, type AssetId, type AttentionLevel, type ElasticState, type ToolName } from './types'

export const SPINE_TOOLS = ['get_workspace', 'set_intent', 'get_attention_state', 'search_workspace', 'list_drawer', 'pin_element', 'restore_capability', 'undo_last_adaptation'] as const satisfies readonly ToolName[]
export const ALL_TOOLS: ToolName[] = [...SPINE_TOOLS, 'get_document_outline', 'get_document_section', 'get_transcript_segment', 'list_references', 'compare_sources', 'subscribe_newsletter', 'list_related_videos', 'share_asset', 'create_citation']
export function assetAttention(state: ElasticState, assetId: AssetId): AttentionLevel {
  const levels = Object.values(state.elements).filter((element) => element.assetId === assetId).map((element) => state.attention[element.id])
  return levels.reduce((best, level) => LEVELS[level] > LEVELS[best] ? level : best, 'DRAWER' as AttentionLevel)
}
const atLeast = (state: ElasticState, id: AssetId, level: keyof typeof LEVELS) => LEVELS[assetAttention(state, id)] >= LEVELS[level]
const focusedAssets = (state: ElasticState) => (['paper', 'video', 'references', 'publisher', 'dataset'] as const).filter((id) => assetAttention(state, id) === 'FOCUSED')

export const CAPABILITY_RULES: Record<Exclude<ToolName, typeof SPINE_TOOLS[number]>, (state: ElasticState) => boolean> = {
  get_document_outline: (s: ElasticState) => atLeast(s, 'paper', 'CONTEXT'), get_document_section: (s: ElasticState) => atLeast(s, 'paper', 'CONTEXT'),
  get_transcript_segment: (s: ElasticState) => atLeast(s, 'video', 'CONTEXT'), list_references: (s: ElasticState) => atLeast(s, 'references', 'CONTEXT'),
  compare_sources: (s: ElasticState) => focusedAssets(s).length >= 2, subscribe_newsletter: (s: ElasticState) => atLeast(s, 'publisher', 'CONTEXT'),
  list_related_videos: (s: ElasticState) => atLeast(s, 'publisher', 'CONTEXT'), share_asset: (s: ElasticState) => atLeast(s, 'publisher', 'CONTEXT'),
  create_citation: (s: ElasticState) => assetAttention(s, 'paper') === 'FOCUSED',
}
export function capabilityEligibility(tool: ToolName, state: ElasticState): boolean { return (SPINE_TOOLS as readonly ToolName[]).includes(tool) || CAPABILITY_RULES[tool as Exclude<ToolName, typeof SPINE_TOOLS[number]>](state) }
export function focusedIds(state: ElasticState): string[] { return focusedAssets(state) }
