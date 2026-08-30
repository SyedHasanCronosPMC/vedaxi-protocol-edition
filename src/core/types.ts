export const LEVELS = { DRAWER: 0, PERIPHERAL: 1, CONTEXT: 2, FOCUSED: 3 } as const
export type AttentionLevel = keyof typeof LEVELS
export type ActorSource = 'human-ui' | 'webmcp-agent'
export type ElementId = 'paper' | 'video' | 'references' | 'publisher' | 'dataset'
export type ToolName =
  | 'get_workspace' | 'set_intent' | 'get_attention_state' | 'search_workspace' | 'list_drawer' | 'pin_element' | 'restore_capability' | 'undo_last_adaptation'
  | 'get_document_outline' | 'get_document_section' | 'get_transcript_segment' | 'list_references' | 'compare_sources' | 'subscribe_newsletter' | 'list_related_videos' | 'share_asset' | 'create_citation'

export interface Element { id: ElementId; label: string; aliases: string[]; weight: number; interfaceCost: number }
export interface Rationale { id: string; elementId: ElementId; from: AttentionLevel; to: AttentionLevel; summary: string; source: ActorSource; score: number }
export interface Transition { attention: Record<ElementId, AttentionLevel>; pins: Partial<Record<ElementId, AttentionLevel>>; intent: ElasticState['intent']; rationale: Record<string, Rationale>; source: ActorSource }
export interface ElasticState {
  intent: { text: string; constraints: string[]; parsedAt: number } | null
  elements: Record<ElementId, Element>
  attention: Record<ElementId, AttentionLevel>
  pins: Partial<Record<ElementId, AttentionLevel>>
  rationale: Record<string, Rationale>
  history: Transition[]
  surface: { live: ToolName[]; revision: number }
  events: Array<{ type: string; detail: unknown }>
}
export interface ToolResult { content: Array<{ type: 'text'; text: string }>; structuredContent: { ok: boolean; reason?: 'attention_state'; hint?: string; currentFocus?: ElementId[]; remedy?: { tool: 'set_intent'; or: 'pin_element' }; payload?: unknown } }
