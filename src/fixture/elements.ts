import type { Element, ElementId } from '../core/types'

export const elements: Record<ElementId, Element> = {
  paper: { id: 'paper', label: 'Thermal comfort paper', aliases: ['paper', 'methodology', 'method', 'methods', 'study design', 'participants', 'setting', 'instrumentation', 'variables', 'analysis', 'results'], weight: 1, interfaceCost: .2 },
  video: { id: 'video', label: 'Author talk and transcript', aliases: ['video', 'talk', 'author says', 'transcript'], weight: 1, interfaceCost: .3 },
  references: { id: 'references', label: 'References', aliases: ['references', 'citations'], weight: .8, interfaceCost: .2 },
  publisher: { id: 'publisher', label: 'Publisher tools', aliases: ['newsletter', 'related videos', 'share'], weight: .7, interfaceCost: .4 },
  dataset: { id: 'dataset', label: 'Dataset', aliases: ['dataset', 'data', 'demographics'], weight: .8, interfaceCost: .2 },
}

export const S0_ATTENTION = { paper: 'CONTEXT', video: 'CONTEXT', references: 'CONTEXT', publisher: 'CONTEXT', dataset: 'CONTEXT' } as const
