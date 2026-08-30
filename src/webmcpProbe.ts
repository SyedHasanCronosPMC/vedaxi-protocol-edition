export type ProbeToolName = 'a' | 'b' | 'c' | 'd'

type ToolResult = {
  content: Array<{ type: 'text'; text: string }>
  structuredContent: { ok: true; probe: string; observedAt: string }
}

type ProbeTool = {
  name: ProbeToolName
  description: string
  inputSchema: { type: 'object'; properties: Record<string, never>; additionalProperties: false }
  annotations: { readOnlyHint: true }
  execute: () => Promise<ToolResult>
}

type ModelContext = {
  registerTool: (tool: ProbeTool, options: { signal: AbortSignal }) => Promise<void>
}

declare global {
  interface Document { modelContext?: ModelContext }
}

const live = new Map<ProbeToolName, AbortController>()

export function webMcpSupported(): boolean {
  return typeof document.modelContext?.registerTool === 'function'
}

function probeTool(name: ProbeToolName): ProbeTool {
  return {
    name,
    description: `Elastic Web G1 probe ${name.toUpperCase()}. Returns a confirmation that this WebMCP tool executed.`,
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    async execute() {
      return {
        content: [{ type: 'text', text: `Elastic Web G1 probe ${name.toUpperCase()} executed.` }],
        structuredContent: { ok: true, probe: name.toUpperCase(), observedAt: new Date().toISOString() },
      }
    },
  }
}

async function register(name: ProbeToolName): Promise<void> {
  if (!webMcpSupported() || live.has(name)) return
  const controller = new AbortController()
  await document.modelContext!.registerTool(probeTool(name), { signal: controller.signal })
  live.set(name, controller)
}

function unregister(name: ProbeToolName): void {
  live.get(name)?.abort()
  live.delete(name)
}

export async function registerInitialProbeSurface(): Promise<ProbeToolName[]> {
  for (const name of ['a', 'b', 'c'] as const) await register(name)
  return currentProbeSurface()
}

export async function swapProbeSurface(): Promise<ProbeToolName[]> {
  unregister('b')
  unregister('c')
  await register('d')
  return currentProbeSurface()
}

export function currentProbeSurface(): ProbeToolName[] { return [...live.keys()] }

export function clearProbeSurface(): void {
  for (const name of [...live.keys()]) unregister(name)
}
