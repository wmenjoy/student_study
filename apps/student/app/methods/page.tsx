import Link from "next/link"
import { methodGroups } from "../../lib/catalog"

export default function MethodsPage() {
  return (
    <div>
      <h2>方法馆</h2>
      <p className="hint">按“画图法/还原法/分析法/枚举法/转化法/公式法/假设法”等方法组织的练习入口。</p>
      {methodGroups.map(group => (
        <div key={group.label}>
          <h3 style={{ marginTop: 12 }}>{group.label}</h3>
          <section className="grid">
            {group.items.map(it => (
              <article key={it.href} className="card"><Link href={it.href}><h3 className="card-title">{it.title}</h3><p className="card-desc">{it.desc}</p></Link></article>
            ))}
          </section>
        </div>
      ))}
    </div>
  )
}