import type { AttentionLevel, Element } from '../core/types'
import { semanticRepresentation } from './model'
export function SemanticText({ element, level }: { element: Element; level: AttentionLevel }) {
  const lines = semanticRepresentation(element, level)
  return <div className={`semantic semantic-${level.toLowerCase()}`}>{lines.map((line, index) => index === 0 ? <strong key={line}>{line}</strong> : <span key={line}>{line}</span>)}</div>
}
