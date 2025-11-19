import Link from "next/link"
import { templates } from "../../lib/catalog"

export default function TemplatesPage() {
  return (
    <div>
      <h2>模板演示</h2>
      <section className="grid">
        {templates.map(it => (
          <article key={it.href} className="card"><Link href={it.href}><h3 className="card-title">{it.title}</h3><p className="card-desc">{it.desc}</p></Link></article>
        ))}
      </section>
    </div>
  )
}