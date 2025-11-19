"use client"
import { useState } from "react"
import { ProbabilityTree } from "../../../components/ProbabilityTree"
import { mapProbTreeState } from "../../../lib/mapping"
import { guidanceFor } from "../../../lib/microGuidance"
import { LessonRunner } from "../../../components/LessonRunner"

export default function ProbPage() {
  const [first, setFirst] = useState([{ p: 0.5, label: "红" }, { p: 0.5, label: "蓝" }])
  const [second, setSecond] = useState([{ p: 0.6, label: "大" }, { p: 0.4, label: "小" }])
  const sum = (arr: Array<{p:number}>) => arr.reduce((a,b)=>a+b.p,0)
  return (
    <LessonRunner
      title="树形概率"
      skillId="math-prob"
      intro={{
        story: "从袋子里先抽颜色，再看大小，记录每种情况发生的可能性。",
        goal: "会把两次试验的概率用树形图表示并计算合概率",
        steps: ["设置每层分支概率","确保每层之和为1","点击评估生成合概率列表"]
      }}
      onVariant={() => {
        const f1 = parseFloat((Math.random()*0.7+0.2).toFixed(2))
        const f2 = parseFloat((1-f1).toFixed(2))
        const s1 = parseFloat((Math.random()*0.7+0.2).toFixed(2))
        const s2 = parseFloat((1-s1).toFixed(2))
        setFirst([{p:f1,label:"红"},{p:f2,label:"蓝"}]); setSecond([{p:s1,label:"大"},{p:s2,label:"小"}])
      }}
      hints={{
        build: ["设置第一层各分支概率","设置第二层各分支概率","保证每层加起来=1"],
        map: ["点击评估","读出各路径的合概率","把结果排序记录"],
        review: ["调整比例，观察合概率的变化"]
      }}
      variantGen={(diff) => {
        const make = (f:number,s:number) => ({ label: `第一层红=${f.toFixed(2)} 第二层大=${s.toFixed(2)}`, apply: () => { const f2 = parseFloat((1-f).toFixed(2)); const s2 = parseFloat((1-s).toFixed(2)); setFirst([{p:f,label:"红"},{p:f2,label:"蓝"}]); setSecond([{p:s,label:"大"},{p:s2,label:"小"}]) } })
        if (diff === "easy") return [make(0.5,0.5), make(0.6,0.4), make(0.4,0.6)]
        if (diff === "medium") return [make(0.7,0.3), make(0.55,0.45), make(0.45,0.55), make(0.65,0.35)]
        return [make(0.8,0.2), make(0.3,0.7), make(0.75,0.25), make(0.4,0.6), make(0.62,0.38)]
      }}
      variantCount={5}
      microTestGen={(diff) => {
        const fSum = first.reduce((a,b)=>a+b.p,0)
        const sSum = second.reduce((a,b)=>a+b.p,0)
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const p = (x:number,y:number)=> (x*y).toFixed(2)
        const f0 = first[0].p, s0 = second[0].p
        if (diff === "easy") {
          items.push({ prompt: `检查第一层概率和是否为1（输入 yes/no）`, placeholder: "yes 或 no", check: v => (Math.abs(fSum-1)<1e-6 ? v.toLowerCase()==="yes" : v.toLowerCase()==="no") })
          items.push({ prompt: `路径 红→大 的合概率是多少？（两位小数）`, placeholder: "输入概率", check: v => v.trim()===p(f0,s0) })
        } else if (diff === "medium") {
          items.push({ prompt: `把第一层‘红’概率改为 ${ (f0+0.1).toFixed(2) }，‘蓝’自动为多少？（两位小数）`, placeholder: "输入概率", check: v => v.trim()=== (1-(f0+0.1)).toFixed(2) })
          items.push({ prompt: `路径 蓝→小 的合概率是多少？（两位小数）`, placeholder: "输入概率", check: v => v.trim()=== p(first[1].p, second[1].p) })
        } else {
          items.push({ prompt: `请列出四条路径的合概率之和（两位小数）`, placeholder: "输入总和", check: v => v.trim()===( (first[0].p*second[0].p + first[0].p*second[1].p + first[1].p*second[0].p + first[1].p*second[1].p).toFixed(2) ) })
          items.push({ prompt: `把第二层‘大’改为 ${ (s0+0.1).toFixed(2) }，‘小’自动为多少？（两位小数）`, placeholder: "输入概率", check: v => v.trim()===(1-(s0+0.1)).toFixed(2) })
          items.push({ prompt: `路径 红→大 的新合概率是多少？（两位小数）`, placeholder: "输入概率", check: v => v.trim()=== p(first[0].p, s0+0.1) })
        }
        return items
      }}
      onEvaluate={() => {
        const text = mapProbTreeState(first, second)
        const valid = Math.abs(sum(first) - 1) < 1e-6 && Math.abs(sum(second) - 1) < 1e-6
        const hint = valid ? guidanceFor("prob_ok") : guidanceFor("prob_sum_not_one")
        return { correct: valid, text, hint }
      }}
    >
      <ProbabilityTree first={first} second={second} />
      <div className="hint">每层概率和需为1，读出合概率并理解分支意义。</div>
    </LessonRunner>
  )
}