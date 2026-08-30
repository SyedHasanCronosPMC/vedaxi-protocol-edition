import type { ElasticState } from '../core/types'
import { renderModel } from '../core/renderModel'
import { SemanticText } from './SemanticText'
export function Zone({ title, state, ids }: { title: string; state: ElasticState; ids: string[] }) {
  const model = renderModel(state)
  return <section className={`zone zone-${title.toLowerCase().replaceAll(' ', '-')}`} aria-label={title}><h2>{title}</h2>{ids.map((id) => {
    const element = state.elements[id]; const item = model[id]
    return <article className="element" key={id}><SemanticText element={element} level={item.level} />{item.rationale && <small className="rationale">{item.rationale}</small>}</article>
  })}</section>
}
