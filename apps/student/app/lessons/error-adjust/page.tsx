"use client"
import { useState } from "react"
import { ErrorAdjust } from "../../../components/ErrorAdjust"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapErrorAdjust } from "../../../lib/mapping"
import { guidanceFor } from "../../../lib/microGuidance"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function ErrorAdjustPage() {
  const [wrongSum,setWrongSum]=useState(58)
  const [wd,setWd]=useState(2)
  const [cd,setCd]=useState(6)
  const [place,setPlace]=useState(10)
  const [stage,setStage]=useState(0)
  const steps=["准备：填写错误和与误读位","更正：填写正确位与位值","计算：补上的数量与正确和"]
  const onStep=(i:number)=>{ setStage(i) }
  return (
    <LessonRunner
      title="错中求解"
      skillId="math-error-adjust"
      intro={{
        story: "小伙伴把十位上的数字看错了，导致加法结果偏小。",
        goal: "找出少算的部分并加回来得到正确和",
        steps: ["设置错误和与误读位","确定正确位与位值","点击评估生成表达"]
      }}
      hints={{
        build: ["输入错误和","输入误读位与正确位","选择位值（个位/十位/百位）"],
        map: ["点击评估","读出‘补上的数量’与‘正确和’"],
        review: ["总结：把误读改正后要补多少？"]
      }}
      variantGen={(diff) => {
        const make = (ws:number, wd1:number, cd1:number, pl1:number) => ({ label: `和=${ws} 误=${wd1} 正=${cd1} 位=${pl1}`, apply: () => { setWrongSum(ws); setWd(wd1); setCd(cd1); setPlace(pl1) } })
        if (diff === "easy") return [make(58,2,6,10), make(45,3,5,10), make(72,4,6,10)]
        if (diff === "medium") return [make(96,3,7,10), make(132,4,9,10), make(205,1,3,100), make(306,2,5,100)]
        return [make(420,2,8,10), make(508,1,7,10), make(780,3,9,10), make(902,5,9,10), make(1205,2,3,100)]
      }}
      microTestGen={(diff) => {
        const delta = (cd - wd) * place
        const right = wrongSum + delta
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") {
          items.push({ prompt: `补上的数量是多少？`, placeholder: "输入补上的数量", check: v => Math.abs(parseFloat(v) - delta) < 1e-6 })
          items.push({ prompt: `正确的和是多少？`, placeholder: "输入正确和", check: v => Math.abs(parseFloat(v) - right) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `把位值改为 ${place*10} 的补上数量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - (cd - wd) * place * 10) < 1e-6 })
          items.push({ prompt: `若误读位变为 ${wd+1}，新的正确和`, placeholder: "输入正确和", check: v => Math.abs(parseFloat(v) - (wrongSum + (cd - (wd+1)) * place)) < 1e-6 })
        } else {
          items.push({ prompt: `把正确位改为 ${cd+2}，新的补上数量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - ((cd+2) - wd) * place) < 1e-6 })
          items.push({ prompt: `把错误和改为 ${wrongSum+15}，新的正确和`, placeholder: "输入正确和", check: v => Math.abs(parseFloat(v) - (wrongSum+15 + delta)) < 1e-6 })
          items.push({ prompt: `解释：补上数量为何是(正确位−误读位)×位值？输入 yes`, placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" })
        }
        return items
      }}
      onEvaluate={()=>{
        const text = mapErrorAdjust(wrongSum, wd, cd, place)
        const correct = cd>=wd
        const hint = correct ? guidanceFor("error_ok") : guidanceFor("error_check")
        return { correct, text, hint }
      }}
    >
      <Narration avatar="/mascots/bear.svg" name="阿奇熊">我把十位上的数字看错了，结果算少了。帮我把少算的部分加回去吧！</Narration>
      <div className="controls">
        <div className="control"><label>错误和</label><input type="number" value={wrongSum} onChange={e=>setWrongSum(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>误读位数字</label><input type="number" value={wd} onChange={e=>setWd(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>正确位数字</label><input type="number" value={cd} onChange={e=>setCd(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>位值</label><input type="number" value={place} onChange={e=>setPlace(parseFloat(e.target.value||"1"))} /></div>
      </div>
      <ErrorAdjust wrongSum={wrongSum} wrongDigit={wd} correctDigit={cd} place={place} onChange={(w,wd1,cd1,pl1)=>{ setWrongSum(w); setWd(wd1); setCd(cd1); setPlace(pl1) }} />
      <div className="hint">把少算的部分加回到错误的和，得到正确的和。</div>
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}