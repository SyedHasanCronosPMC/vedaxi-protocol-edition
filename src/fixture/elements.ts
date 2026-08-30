import type { AttentionLevel, Element, ElementId } from '../core/types'

const semantic = (peripheral: string, candidate: string, focused: string[]): Element['semantic'] => ({ peripheral, candidate, focused })
const element = (id: string, assetId: Element['assetId'], label: string, aliases: string[], content = ''): Element => ({ id, assetId, label, aliases, weight: 1, interfaceCost: .2, content, semantic: semantic(label, `${label} · supporting evidence`, [label, content]) })

const segments = Object.fromEntries(Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0'); const id = `video.segment.${number}`
  const content = number === '07' ? 'At about 03:10, the speaker says a 2°C rise above neutral cuts task performance by about 8 percent.' : `Author talk transcript segment ${number}.`
  return [id, { ...element(id, 'video', `Video segment ${number}`, number === '07' ? ['video', 'talk', '2°c', '8 percent'] : ['video', 'talk', 'transcript'], content), semantic: semantic(`Video · ${number}`, `Video segment ${number} · thermal comfort`, [`Video segment ${number}`, content]) }]
})) as Record<string, Element>

export const elements: Record<ElementId, Element> = {
  'paper.methodology': { ...element('paper.methodology', 'paper', 'Methodology', ['paper', 'methodology', 'method', 'methods', 'study design', 'participants', 'setting', 'instrumentation', 'variables', 'analysis']), semantic: semantic('Methodology · pp. 4–7', 'Methodology · participants · setting · analysis', ['Methodology', 'Participants', 'Setting', 'Instrumentation', 'Independent variables', 'Analysis procedure']) },
  'paper.results': { ...element('paper.results', 'paper', 'Results', ['paper', 'results', 'effect size'], 'Measured effect: 4–11%, with wide confidence intervals.'), semantic: semantic('Results · p. 8', 'Results · effect size', ['Results', 'Measured effect: 4–11%, with wide confidence intervals.']) },
  'paper.limitations': element('paper.limitations', 'paper', 'Limitations', ['limitations'], '34 participants, one climate zone, three weeks; no broad generalization.'),
  references: element('references', 'references', 'References', ['references', 'citations']),
  publisher: element('publisher', 'publisher', 'Publisher tools', ['newsletter', 'related videos', 'share']),
  dataset: element('dataset', 'dataset', 'Dataset', ['dataset', 'data', 'demographics']),
  ...segments,
}

export const S0_ATTENTION: Record<ElementId, AttentionLevel> = Object.fromEntries(Object.keys(elements).map((id) => [id, 'CONTEXT']))
