"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { AgeDiffSum } from "../../../components/AgeDiffSum"
import { ageScript } from "../../../lib/stepdsl"
import { mapAge } from "../../../lib/mapping"

export default function AgePage() {
  const [sum,setSum]=useState(30)
  const [diff,setDiff]=useState(4)
  const [years,setYears]=useState(6)
  const [stage,setStage]=useState(0)
  const steps=ageScript.labels
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="公式法：年龄问题" skillId="math-age" intro={{ story: "两人的年龄有和与差，几年后的年龄如何？", goal: "会用和差公式求年龄并推算", steps }} hints={ageScript.hints} variantGen={(diff)=>{
      const make=(s:number,d:number,y:number)=>({label:`和${s} 差${d} 过${y}年`,apply:()=>{setSum(s);setDiff(d);setYears(y);setStage(0)}})
      if(diff==="easy") return [make(20,4,5),make(30,6,5)]
      if(diff==="medium") return [make(40,8,10),make(36,2,6)]
      return [make(50,10,12),make(44,4,8)]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const A=(sum+diff)/2, B=(sum-diff)/2
      const Af=A+years, Bf=B+years
      if(diff==="easy") items.push({prompt:"当前年龄A是多少？",placeholder:"输入数字",check:x=>parseInt(x)===A})
      else if(diff==="medium") items.push({prompt:"当前年龄B是多少？",placeholder:"输入数字",check:x=>parseInt(x)===B})
      else items.push({prompt:"几年后两人的年龄？写如 A,B",placeholder:"如 15,13",check:x=>x.replaceAll(' ','')===`${Af},${Bf}`})
      return items
    }} onEvaluate={()=>({ correct: true, text: mapAge(sum,diff,years) })}>
      <div className="controls">
        <div className="control"><label>和</label><input type="number" value={sum} onChange={e=>setSum(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>差</label><input type="number" value={diff} onChange={e=>setDiff(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>几年后</label><input type="number" value={years} onChange={e=>setYears(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <AgeDiffSum sum={sum} diff={diff} years={years} stage={stage} />
      <Narration avatar="/icons/ratio.svg" name="老师">{ageScript.narration[stage]||""}</Narration>
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={ageScript.durations} auto />
    </LessonRunner>
  )
}