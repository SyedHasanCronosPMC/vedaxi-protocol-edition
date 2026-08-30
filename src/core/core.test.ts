import { describe, expect, test, beforeEach } from 'vitest'
import { applyIntent } from './applyIntent'
import { ALL_TOOLS, SPINE_TOOLS, capabilityEligibility } from './eligibility'
import { deriveToolSurface } from './deriveToolSurface'
import { renderModel } from './renderModel'
import { resetStore, store } from './store'
import { undoLastAdaptation } from './undo'
import { gated } from '../webmcp/gated'
import { queueSurface, registrySnapshot, resetRegistry, withExecutionGuard } from '../webmcp/registry'

const methodology = 'Help me understand the methodology in this paper'
const comparison = 'Compare the methodology with what the author says in the video'
beforeEach(() => { resetStore(); resetRegistry() })

describe('G2 invariants', () => {
  test('spine survives S0, S1, and S2 and is never scheduled for removal', () => {
    const states = [store.state, applyIntent(methodology, [], 'human-ui').state, applyIntent(comparison, [], 'human-ui').state]
    for (const state of states) { const surface = deriveToolSurface(state); for (const tool of SPINE_TOOLS) { expect(surface.eligible.has(tool)).toBe(true); expect(surface.unregister).not.toContain(tool) } }
  })
  test('compare_sources requires two focused assets', () => {
    expect(capabilityEligibility('compare_sources', store.state)).toBe(false)
    expect(capabilityEligibility('compare_sources', applyIntent(methodology, [], 'human-ui').state)).toBe(false)
    expect(capabilityEligibility('compare_sources', applyIntent(comparison, [], 'human-ui').state)).toBe(true)
  })
  test('stale registered compare_sources refuses before invoking its underlying operation', () => {
    applyIntent(methodology, [], 'human-ui'); let called = false
    const run = gated('compare_sources', () => { called = true; return { content: [], structuredContent: { ok: true } } })
    const result = run(); expect(called).toBe(false); expect(result.structuredContent).toMatchObject({ ok: false, reason: 'attention_state', remedy: { tool: 'set_intent' } })
  })
  test('render model and capability surface are projections of the same committed state', () => {
    for (const state of [store.state, applyIntent(methodology, [], 'human-ui').state, applyIntent(comparison, [], 'human-ui').state]) {
      const render = renderModel(state); const surface = deriveToolSurface(state)
      for (const [id, level] of Object.entries(state.attention)) expect(render[id as keyof typeof render].level).toBe(level)
      for (const tool of ALL_TOOLS) expect(surface.eligible.has(tool)).toBe(capabilityEligibility(tool, state))
    }
  })
  test('human and agent commands produce equivalent committed attention and eligibility', () => {
    const human = applyIntent(methodology, [], 'human-ui'); resetStore(); const agent = applyIntent(methodology, [], 'webmcp-agent')
    expect(human.state.attention).toEqual(agent.state.attention); expect([...human.surface.eligible]).toEqual([...agent.surface.eligible]); expect(Object.values(human.state.rationale)[0]?.source).toBe('human-ui'); expect(Object.values(agent.state.rationale)[0]?.source).toBe('webmcp-agent')
  })
  test('surface mutation is deferred until an execution settles', async () => {
    const surface = deriveToolSurface(store.state); let during = registrySnapshot()
    await withExecutionGuard(async () => { queueSurface(surface); during = registrySnapshot(); expect(during.pending).toBe(true); expect(during.applied).toBe(0) })
    expect(registrySnapshot()).toMatchObject({ inFlight: 0, pending: false, applied: 1 })
  })
  test('undo restores attention, render model, and eligibility', () => {
    const before = store.state; const beforeRender = renderModel(before); const beforeEligible = [...deriveToolSurface(before).eligible]
    applyIntent(methodology, [], 'human-ui'); const restored = undoLastAdaptation().state
    expect(restored.attention).toEqual(before.attention); expect(renderModel(restored)).toEqual(beforeRender); expect([...deriveToolSurface(restored).eligible]).toEqual(beforeEligible); expect(restored.history).toHaveLength(0)
  })
})
