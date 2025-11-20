import Link from "next/link"
import { homeMath } from "../../lib/catalog"

export default function MathLandingPage() {
  return (
    <div>
      <h2>数学入口</h2>
      <p className="hint">从这里进入“方法馆”和“应用题”等分区。</p>
      <section className="grid">
        <article className="card"><Link href="/methods"><h3 className="card-title">方法馆</h3><p className="card-desc">画图法、转化法、分析/枚举法等。</p></Link></article>
        <article className="card"><Link href="/grade2"><h3 className="card-title">应用题</h3><p className="card-desc">二年级常见应用题专题入口。</p></Link></article>
        <article className="card"><Link href="/templates"><h3 className="card-title">模板演示</h3><p className="card-desc">基础模型与交互演示合集。</p></Link></article>
      </section>
      <h3 style={{ marginTop: 12 }}>数学知识与工具</h3>
      <section className="grid">
        {homeMath.map(it => (
          <article key={it.href} className="card">
            <Link href={it.href}>
              {it.icon && <img src={it.icon} alt={it.title} />}
              <h3 className="card-title">{it.title}</h3>
              <p className="card-desc">{it.desc}。</p>
            </Link>
          </article>
        ))}
      </section>
    </div>
  )
}