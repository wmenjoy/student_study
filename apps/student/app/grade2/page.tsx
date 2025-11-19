import Link from "next/link"
import { grade2Topics } from "../../lib/catalog"

export default function Grade2Page() {
  return (
    <div>
      <h2>二年级专题（图解）</h2>
      <section className="grid">
        {grade2Topics.map(it => (
          <article key={it.href} className="card"><Link href={it.href}><h3 className="card-title">{it.title}</h3><p className="card-desc">{it.desc}。</p></Link></article>
        ))}
      </section>
    </div>
  )
}