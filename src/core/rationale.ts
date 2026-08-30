import type { ActorSource, ElasticState, Rationale } from './types'
export function writeRationale(before: ElasticState, after: ElasticState, source: ActorSource, scores: Record<string, number>): Record<string, Rationale> {
  const records: Record<string, Rationale> = {}
  for (const id of Object.keys(after.attention) as Array<keyof typeof after.attention>) if (before.attention[id] !== after.attention[id]) {
    const key = `r${before.surface.revision + 1}-${id}`
    records[key] = { id: key, elementId: id, from: before.attention[id], to: after.attention[id], source, score: scores[id] ?? 0, summary: after.pins[id] ? 'Pinned by you · protected from demotion' : after.attention[id] === 'DRAWER' ? 'Outside current goal · preserved in drawer' : 'Direct intent match' }
  }
  return records
}
