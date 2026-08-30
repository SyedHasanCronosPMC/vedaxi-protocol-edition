import { capabilityEligibility, focusedIds } from '../core/eligibility'
import { store } from '../core/store'
import type { ToolName, ToolResult } from '../core/types'
export function gated(tool: ToolName, execute: () => ToolResult, hint = 'Bring a second source into focus first.'): () => ToolResult {
  return () => capabilityEligibility(tool, store.state) ? execute() : { content: [{ type: 'text', text: `Not available in the current focus. ${hint}` }], structuredContent: { ok: false, reason: 'attention_state', hint, currentFocus: focusedIds(store.state), remedy: { tool: 'set_intent', or: 'pin_element' } } }
}
