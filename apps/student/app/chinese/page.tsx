import Link from "next/link"

export default function ChineseLandingPage() {
  return (
    <div>
      <h2>语文入口</h2>
      <p className="hint">按知识类别进入练习与演示。</p>
      <section className="grid">
        <article className="card"><Link href="/lessons/hanzi"><h3 className="card-title">汉字</h3><p className="card-desc">笔画演示与临摹。</p></Link></article>
        <article className="card"><Link href="/lessons/words"><h3 className="card-title">词语</h3><p className="card-desc">近反义词小游戏。</p></Link></article>
        <article className="card"><Link href="/lessons/sentence-order"><h3 className="card-title">句子重排</h3><p className="card-desc">语序与表达。</p></Link></article>
        <article className="card"><Link href="/lessons/punctuation"><h3 className="card-title">标点练习</h3><p className="card-desc">停顿与语气。</p></Link></article>
      </section>
    </div>
  )
}