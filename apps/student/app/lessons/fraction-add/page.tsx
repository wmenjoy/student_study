"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { FractionLCMAnimated } from "../../../components/FractionLCMAnimated"
import { StepPlayer } from "../../../components/StepPlayer"
import { fractionScript } from "../../../lib/stepdsl"
import { Narration } from "../../../components/Narration"

export default function FractionAddPage() {
  const [aN, setAN] = useState(1)
  const [aD, setAD] = useState(3)
  const [bN, setBN] = useState(1)
  const [bD, setBD] = useState(2)
  const [op, setOp] = useState<"+" | "-">("+")
  const [stage, setStage] = useState(0)
  const steps = fractionScript.labels

  const onStep = (i: number) => setStage(i)

  // Speak function
  const speak = (msg: string) => {
    if (typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(msg)
      u.lang = 'zh-CN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  // Helper to calculate factors and LCM
  const getFactors = (n: number) => {
    const mm = new Map<number, number>()
    let d = 2
    let m = Math.abs(n)
    while (d * d <= m) {
      while (m % d === 0) {
        mm.set(d, (mm.get(d) || 0) + 1)
        m /= d
      }
      d++
    }
    if (m > 1) mm.set(m, (mm.get(m) || 0) + 1)
    return mm
  }

  // Effect for narration and events
  useEffect(() => {
    const narrationText = fractionScript.narration[stage] || ''

    const ca = getFactors(aD)
    const cb = getFactors(bD)
    const primes = Array.from(new Set([...ca.keys(), ...cb.keys()])).sort((x, y) => x - y)
    const mk = (p: number) => Math.max(ca.get(p) || 0, cb.get(p) || 0)

    let eventText = ""
    const ev = fractionScript.events?.[stage] || ""

    if (ev === "merge_factors") {
      eventText = `事件：合并因子 ${primes.map(p => `${p}^${mk(p)}`).join('·')}`
    } else if (ev === "refine_to_lcm") {
      const lcm = primes.reduce((acc, p) => acc * Math.pow(p, mk(p)), 1)
      eventText = `事件：细分到LCM，a×${lcm / aD}，b×${lcm / bD}`
    }

    const fullText = [narrationText, eventText].filter(Boolean).join("。")
    if (fullText) {
      speak(fullText)
    }
  }, [stage, aD, bD, aN, bN, op])

  // Helper for event text display
  const getEventText = () => {
    const ca = getFactors(aD)
    const cb = getFactors(bD)
    const primes = Array.from(new Set([...ca.keys(), ...cb.keys()])).sort((x, y) => x - y)
    const mk = (p: number) => Math.max(ca.get(p) || 0, cb.get(p) || 0)

    const ev = fractionScript.events?.[stage] || ""
    if (ev === "merge_factors") {
      return `事件：合并因子 ${primes.map(p => `${p}^${mk(p)}`).join('·')}`
    } else if (ev === "refine_to_lcm") {
      const lcm = primes.reduce((acc, p) => acc * Math.pow(p, mk(p)), 1)
      return `事件：细分到LCM，a×${lcm / aD}，b×${lcm / bD}`
    }
    return ""
  }

  const eventText = getEventText()

  return (
    <LessonRunner
      title="分数通分与约分动画"
      skillId="math-fraction-add"
      intro={{ story: "用LCM通分再加减，再约分。", goal: "会通分与约分得到最简", steps: steps }}
      hints={fractionScript.hints}
      variantGen={(diff) => {
        const make = (an: number, ad: number, bn: number, bd: number, opx: "+" | "-") => ({ label: `${an}/${ad} ${opx} ${bn}/${bd}`, apply: () => { setAN(an); setAD(ad); setBN(bn); setBD(bd); setOp(opx); setStage(0) } })
        if (diff === "easy") return [make(1, 3, 1, 2, "+"), make(1, 4, 1, 4, "+"), make(2, 5, 1, 5, "-")]
        if (diff === "medium") return [make(2, 3, 3, 4, "+"), make(3, 5, 2, 3, "-"), make(1, 6, 5, 12, "+")]
        return [make(5, 12, 7, 18, "+"), make(4, 9, 5, 6, "-"), make(7, 10, 3, 25, "+")]
      }}
      microTestGen={(diff) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const g = (x: number, y: number) => { x = Math.abs(x); y = Math.abs(y); while (y) { const t = x % y; x = y; y = t } return x }
        const l = (x: number, y: number) => Math.abs(x * y) / g(x, y)
        const den = l(aD, bD)
        const ca = getFactors(aD), cb = getFactors(bD)
        const aEq = aN * (den / aD)
        const bEq = bN * (den / bD)
        const tot = op === "+" ? aEq + bEq : aEq - bEq
        const gg = g(Math.abs(tot), den)
        const simp = `${Math.abs(tot) / gg}/${den / gg}`
        if (diff === "easy") { items.push({ prompt: "LCM是多少？", placeholder: "输入LCM", check: x => Math.abs(parseFloat(x) - den) < 1e-6 }) }
        else if (diff === "medium") {
          items.push({ prompt: "等值分数是多少？写出 a' 与 b' 的和/差", placeholder: "写如 5/12", check: x => x.replace(/ /g, "") === `${tot}/${den}` });
          items.push({
            prompt: "列出LCM的因子幂次（如 2^2·3^1）", placeholder: "输入表达式", check: x => {
              const primes = Array.from(new Set([...ca.keys(), ...cb.keys()])).sort((x, y) => x - y)
              const mk = (p: number) => Math.max(ca.get(p) || 0, cb.get(p) || 0)
              const expect = primes.map(p => `${p}^${mk(p)}`).join("·")
              return x.replace(/ /g, "") === expect
            }
          })
        }
        else {
          items.push({ prompt: "最简结果是多少？", placeholder: "写如 5/12", check: x => x.replace(/ /g, "") === simp })
          const gexp = (n: number) => { const mm = getFactors(n); return Array.from(mm.entries()).sort((a, b) => a[0] - b[0]).map(([p, k]) => `${p}^${k}`).join("·") }
          items.push({ prompt: "约分因子写成幂次表达式", placeholder: "如 2^1·3^2", check: x => x.replace(/ /g, "") === gexp(gg) })
        }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: "完成通分与约分" })}
    >
      <Narration avatar="/icons/area.svg" name="老师">{fractionScript.narration[stage] || "请观察分数计算过程"}</Narration>
      {eventText && <Narration avatar="/icons/area.svg" name="事件">{eventText}</Narration>}

      <div className="controls" style={{ flexWrap: "wrap" }}>
        <div className="control"><label>a 分子</label><input type="number" value={aN} onChange={e => setAN(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>a 分母</label><input type="number" value={aD} onChange={e => setAD(parseFloat(e.target.value || "1"))} /></div>
        <div className="control"><label>b 分子</label><input type="number" value={bN} onChange={e => setBN(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>b 分母</label><input type="number" value={bD} onChange={e => setBD(parseFloat(e.target.value || "1"))} /></div>
        <div className="control"><label>运算</label><select value={op} onChange={e => setOp(e.target.value as any)}><option value="+">加</option><option value="-">减</option></select></div>
      </div>

      <FractionLCMAnimated aNum={aN} aDen={aD} bNum={bN} bDen={bD} op={op} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={fractionScript.durations} auto />
    </LessonRunner>
  )
}