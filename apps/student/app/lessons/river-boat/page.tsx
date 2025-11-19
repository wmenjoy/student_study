"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { RiverBoatSim } from "../../../components/RiverBoatSim"
import { riverScript } from "../../../lib/stepdsl"
import { mapRiver } from "../../../lib/mapping"

export default function RiverBoatPage() {
  const [v,setV]=useState(12)
  const [c,setC]=useState(3)
  const [L,setL]=useState(30)
  const [stage,setStage]=useState(0)
  const steps=riverScript.labels
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="公式法：流水行船" skillId="math-river-boat" intro={{ story: "行船遇到水流，上下行时间不同。", goal: "会用上/下行公式求时间与差", steps }} hints={riverScript.hints} variantGen={(diff)=>{
      const make=(v:number,c:number,L:number)=>({label:`船${v} 水${c} 距${L}`,apply:()=>{setV(v);setC(c);setL(L);setStage(0)}})
      if(diff==="easy") return [make(10,2,20),make(12,3,30)]
      if(diff==="medium") return [make(15,4,40),make(18,5,36)]
      return [make(20,6,50),make(25,8,60)]
    }} microTestGen={(difficulty)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const up = L/Math.max(0.1, v-c)
      const down = L/Math.max(0.1, v+c)
      const delta = up - down
      if(difficulty==="easy") items.push({prompt:"上行时间是多少？",placeholder:"输入数字",check:x=>Math.abs(parseFloat(x)-up)<1e-6})
      else if(difficulty==="medium") items.push({prompt:"下行时间是多少？",placeholder:"输入数字",check:x=>Math.abs(parseFloat(x)-down)<1e-6})
      else items.push({prompt:"时间差是多少？",placeholder:"输入数字",check:x=>Math.abs(parseFloat(x)-delta)<1e-6})
      return items
    }} onEvaluate={()=>({ correct: true, text: mapRiver(v,c,L) })}>
      <div className="controls">
        <div className="control"><label>船速</label><input type="number" value={v} onChange={e=>setV(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>水速</label><input type="number" value={c} onChange={e=>setC(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>距离</label><input type="number" value={L} onChange={e=>setL(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <RiverBoatSim boat={v} current={c} distance={L} stage={stage} />
      <Narration avatar="/icons/journey.svg" name="老师">{riverScript.narration[stage]||""}</Narration>
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={riverScript.durations} auto />
    </LessonRunner>
  )
}
