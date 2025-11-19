"use client"
import { useState } from "react"
import { CompareMoreLess } from "../../../components/CompareMoreLess"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapCompareMore } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function CompareMorePage() {
  const [base,setBase]=useState(53)
  const [delta,setDelta]=useState(-12)
  const [stage,setStage]=useState(0)
  const steps=["准备：设置基准数量","准备：设置差值（正多负少）","计算：另一项=基准+差值"]
  const onStep=(i:number)=>{ setStage(i) }
  return (
    <LessonRunner title="比多少问题" skillId="math-compare-more" intro={{ story: "三位伙伴收集骨头，路马比阿奇少或多若干。", goal: "根据差值求出另一项数量", steps: ["设置基准与差值","观察两条长度","生成表达"] }} hints={{ build: ["输入基准数量","输入差值（正为多，负为少）"], map: ["点击评估","读出另一项数量=基准+差值"], review: ["把差值方向改一下再试试"] }} variantGen={(diff)=>{
      const make=(b:number,d:number)=>({label:`基=${b} 差=${d}`,apply:()=>{setBase(b);setDelta(d)}})
      if(diff==="easy") return [make(53,-12),make(40,8),make(30,-5)]
      if(diff==="medium") return [make(60,-9),make(45,15),make(70,-20),make(80,12)]
      return [make(100,-25),make(90,18),make(120,-30),make(110,26),make(95,-16)]
    }} microTestGen={(diff)=>{
      const other=base+delta
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      if(diff==="easy"){items.push({prompt:"求 另一项 的数量",placeholder:"输入数量",check:v=>Math.abs(parseFloat(v)-other)<1e-6});items.push({prompt:"求 差 的绝对值",placeholder:"输入差值",check:v=>Math.abs(parseFloat(v)-Math.abs(delta))<1e-6})}
      else if(diff==="medium"){items.push({prompt:`把 差 改为 ${-delta} 的另一项数量`,placeholder:"输入数量",check:v=>Math.abs(parseFloat(v)-(base+(-delta)))<1e-6});items.push({prompt:`把 基准 改为 ${base+5} 的另一项数量`,placeholder:"输入数量",check:v=>Math.abs(parseFloat(v)-((base+5)+delta))<1e-6})}
      else {items.push({prompt:`解释：为何另一项=基准+差值？输入 yes`,placeholder:"输入yes",check:v=>v.trim().toLowerCase()==="yes"});items.push({prompt:`把 差 增加 4 的新另一项`,placeholder:"输入数量",check:v=>Math.abs(parseFloat(v)-(base+(delta+4)))<1e-6})}
      return items
    }} onEvaluate={()=>({ correct: true, text: mapCompareMore(base,delta) })}>
      <Narration avatar="/mascots/bunny.svg" name="泡泡兔">路马和阿奇的数量不一样，差值告诉你多了或少了多少，求出另一项吧！</Narration>
      <div className="controls">
        <div className="control"><label>基准</label><input type="number" value={base} onChange={e=>setBase(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>差值</label><input type="number" value={delta} onChange={e=>setDelta(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <CompareMoreLess base={base} delta={delta} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}