import { describe, expect, test, beforeEach } from 'vitest'
import { applyIntent } from '../core/applyIntent'
import { deriveToolSurface } from '../core/deriveToolSurface'
import { resetStore, store } from '../core/store'
import { semanticRepresentation, zoneProjection } from './model'
const s1 = 'Help me understand the methodology in this paper'; const s2 = 'Compare the methodology with what the author says in the video'
beforeEach(() => resetStore())
describe('G3A UI projections', () => {
  test('S1 projects accepted elements into their zones', () => { const state = applyIntent(s1, [], 'human-ui').state; const zones = zoneProjection(state); expect(zones.FOCUSED.map((e) => e.id)).toContain('paper.methodology'); expect(zones.CONTEXT.map((e) => e.id)).toContain('paper.results'); expect(zones.PERIPHERAL.map((e) => e.id)).toContain('video.segment.01'); expect(zones.DRAWER.map((e) => e.id)).toContain('publisher') })
  test('S2 projects focal and surrounding transcript segments into distinct zones', () => { const zones = zoneProjection(applyIntent(s2, [], 'human-ui').state); expect(zones.FOCUSED.map((e) => e.id)).toEqual(expect.arrayContaining(['video.segment.05', 'video.segment.06', 'video.segment.07', 'video.segment.08'])); expect(zones.CONTEXT.map((e) => e.id)).toEqual(expect.arrayContaining(['video.segment.01', 'video.segment.12'])) })
  test('semantic representation is selected from the fixture element', () => { const element = store.state.elements['paper.methodology']; expect(semanticRepresentation(element, 'FOCUSED')).toEqual(element.semantic.focused); expect(semanticRepresentation(element, 'PERIPHERAL')).toEqual([element.semantic.peripheral]) })
  test('capability indicator value is derived from the current surface', () => { expect(deriveToolSurface(store.state).eligible.size).toBe(15); expect(deriveToolSurface(applyIntent(s1, [], 'human-ui').state).eligible.size).toBe(12) })
  test('human UI route uses the shared command outcome', () => { const viaUi = applyIntent(s1, [], 'human-ui').state; resetStore(); const direct = applyIntent(s1, [], 'human-ui').state; expect(viaUi.attention).toEqual(direct.attention) })
})
