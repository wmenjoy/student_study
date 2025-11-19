"use client"
import { useState, useRef, useEffect } from "react"
import { BalancedScale } from "../../../components/BalancedScale"
import { mapScaleState } from "../../../lib/mapping"
import { guidanceFor } from "../../../lib/microGuidance"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function ScalePage() {
  const [left, setLeft] = useState<number[]>([1])
  const [right, setRight] = useState<number[]>([1])
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：空天平——两边都没有砝码，天平保持水平",
    "步骤2：左边加重——放入砝码，左边变重，天平向左倾斜",
    "步骤3：右边加重——右边也放入砝码，观察变化",
    "步骤4：达到平衡——两边砝码一样重，天平恢复水平"
  ]

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => { return () => clearTimer() }, [])

  const onStep = (i: number) => {
    setStage(i)
    clearTimer()

    if (i === 0) {
      setLeft([])
      setRight([])
    } else if (i === 1) {
      setLeft([])
      setRight([])
      timerRef.current = setTimeout(() => {
        setLeft([1, 1])
      }, 500)
    } else if (i === 2) {
      setLeft([1, 1])
      setRight([])
      timerRef.current = setTimeout(() => {
        setRight([1])
      }, 500)
    } else if (i === 3) {
      setLeft([1, 1])
      setRight([1])
      timerRef.current = setTimeout(() => {
        setRight([1, 1])
      }, 800)
    }
  }

  const addLeft = () => setLeft([...left, 1])
  const addRight = () => setRight([...right, 1])
  const reset = () => { setLeft([]); setRight([]) }

  return (
    <LessonRunner
      title="天平与平衡"
      skillId="math-scale"
      intro={{
        story: "小实验：两边托盘放小石子，看能否保持水平。",
        goal: "学会用等式表达平衡关系",
        steps: ["增减左右砝码", "观察是否平衡", "点击评估生成表达并得到提示"]
      }}
      onVariant={() => {
        const l = Array.from({ length: Math.floor(1 + Math.random() * 4) }, () => 1)
        const r = Array.from({ length: Math.floor(1 + Math.random() * 4) }, () => 1)
        setLeft(l); setRight(r)
        setStage(0)
      }}
      hints={{
        build: ["点击‘左加1’或‘右加1’", "让横杆保持水平", "数一数两边砝码"],
        map: ["点击评估", "读出‘左=右’表达", "把等式写下来"],
        review: ["思考：如果再加同样的砝码在两边，会不会仍然平衡？"]
      }}
      variantGen={(diff) => {
        const make = (ls: number, rs: number) => ({ label: `左=${ls} 右=${rs}`, apply: () => { setLeft(Array.from({ length: ls }, () => 1)); setRight(Array.from({ length: rs }, () => 1)); setStage(0) } })
        if (diff === "easy") return [make(1, 1), make(2, 1), make(1, 2)]
        if (diff === "medium") return [make(2, 2), make(3, 2), make(2, 3), make(4, 3)]
        return [make(3, 3), make(5, 4), make(4, 5), make(6, 4), make(4, 6)]
      }}
      variantCount={5}
      microTestGen={(diff) => {
        const L = left.reduce((a, b) => a + b, 0)
        const R = right.reduce((a, b) => a + b, 0)
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") {
          items.push({ prompt: `当前 左=${L} 右=${R} 是否平衡？输入 yes/no`, placeholder: "yes 或 no", check: v => (L === R ? v.toLowerCase() === "yes" : v.toLowerCase() === "no") })
          items.push({ prompt: `要让右边平衡，需要再加多少？`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - Math.max(0, L - R)) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `把左边再加 1 后，是否平衡？输入 yes/no`, placeholder: "yes 或 no", check: v => (((L + 1) === R) ? v.toLowerCase() === "yes" : v.toLowerCase() === "no") })
          items.push({ prompt: `把两边都加 1 后，差是多少？`, placeholder: "输入差值", check: v => Math.abs(parseFloat(v) - Math.abs((L + 1) - (R + 1))) < 1e-6 })
          items.push({ prompt: `写出平衡等式 左=右 的数值`, placeholder: "例如 3=3", check: v => v.trim() === `${L}=${R}` })
        } else {
          items.push({ prompt: `若右边改为 ${R + 2}，需要左边变成多少才平衡？`, placeholder: "输入左边", check: v => Math.abs(parseFloat(v) - (R + 2)) < 1e-6 })
          items.push({ prompt: `若左边改为 ${L + 3}，差是多少？`, placeholder: "输入差值", check: v => Math.abs(parseFloat(v) - Math.abs((L + 3) - R)) < 1e-6 })
          items.push({ prompt: `把较轻的一边一次性加到平衡需要加多少？`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - Math.abs(L - R)) < 1e-6 })
        }
        return items
      }}
      onEvaluate={() => {
        const L = left.reduce((a, b) => a + b, 0)
        const R = right.reduce((a, b) => a + b, 0)
        const text = mapScaleState(left, right)
        const hint = L === R ? guidanceFor("scale_balanced") : guidanceFor("scale_unbalanced")
        return { correct: L === R, text, hint }
      }}
    >
      <Narration avatar="/mascots/bunny.svg" name="泡泡兔">左右托盘想要平平的，试试给轻的一边多加一个小石子吧！</Narration>

      <div className="controls">
        <button onClick={addLeft}>左边加1</button>
        <button onClick={addRight}>右边加1</button>
        <button onClick={reset} className="btn ghost">清空</button>
      </div>

      <BalancedScale left={left} right={right} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      <div className="hint">通过增减两侧砝码，找到平衡关系并写成等式。</div>
    </LessonRunner>
  )
}