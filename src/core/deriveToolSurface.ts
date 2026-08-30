import { ALL_TOOLS, SPINE_TOOLS, capabilityEligibility } from './eligibility'
import type { ElasticState, ToolName } from './types'
export interface SurfaceDiff { eligible: Set<ToolName>; register: ToolName[]; unregister: ToolName[]; revision: number }
export function deriveToolSurface(state: ElasticState): SurfaceDiff {
  const eligible = new Set(ALL_TOOLS.filter((tool) => capabilityEligibility(tool, state)))
  return { eligible, register: [...eligible].filter((tool) => !state.surface.live.includes(tool)), unregister: state.surface.live.filter((tool) => !eligible.has(tool) && !(SPINE_TOOLS as readonly ToolName[]).includes(tool)), revision: state.surface.revision + 1 }
}
