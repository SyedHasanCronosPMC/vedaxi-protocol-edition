import { S0_ATTENTION, elements } from '../fixture/elements'
import type { ElasticState } from './types'
export function initialState(): ElasticState { return { intent: null, elements, attention: { ...S0_ATTENTION }, pins: {}, rationale: {}, history: [], surface: { live: [], revision: 0 }, events: [] } }
export const store: { state: ElasticState } = { state: initialState() }
export function resetStore(): void { store.state = initialState() }
