import type { SurfaceDiff } from '../core/deriveToolSurface'
let inFlight = 0; let pending: SurfaceDiff | null = null; let applied: SurfaceDiff[] = []
export function queueSurface(diff: SurfaceDiff): void { pending = diff; if (inFlight === 0) flushSurface() }
function flushSurface(): void { if (pending) { applied.push(pending); pending = null } }
export async function withExecutionGuard<T>(fn: () => Promise<T>): Promise<T> { inFlight += 1; try { return await fn() } finally { inFlight -= 1; if (inFlight === 0) flushSurface() } }
export function registrySnapshot(): { inFlight: number; pending: boolean; applied: number } { return { inFlight, pending: pending !== null, applied: applied.length } }
export function resetRegistry(): void { inFlight = 0; pending = null; applied = [] }
