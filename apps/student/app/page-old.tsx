import Link from "next/link"
import { homeMath, homeChinese } from "../lib/catalog"

export default function Page() {
  return (
    <div>
      <section className="hero">
        <h1>一起用图解和动画学习</h1>
        <p>拖一拖、摆一摆、动手参与，快乐掌握数学与语文。</p>
      </section>

      <h3 style={{ marginTop: 32, marginBottom: 16 }}>数学乐园</h3>
      <section className="grid">
        {homeMath.map(it => (
          <article key={it.href} className="card">
            <Link href={it.href}>
              {it.icon && <img src={it.icon} alt={it.title} />}
              <h3 className="card-title">{it.title}</h3>
              <p className="card-desc">{it.desc}</p>
            </Link>
          </article>
        ))}
      </section>

      <h3 style={{ marginTop: 40, marginBottom: 16 }}>语文天地</h3>
      <section className="grid">
        {homeChinese.map(it => (
          <article key={it.href} className="card">
            <Link href={it.href}>
              {it.icon && <img src={it.icon} alt={it.title} />}
              <h3 className="card-title">{it.title}</h3>
              <p className="card-desc">{it.desc}</p>
            </Link>
          </article>
        ))}
      </section>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link className="btn ghost" href="/templates" style={{ padding: '12px 24px', fontSize: '16px' }}>
          查看更多演示模板
        </Link>
      </div>
    </div>
  )
}