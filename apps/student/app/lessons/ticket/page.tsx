"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { TicketSolver } from "../../../components/TicketSolver"
import { ticketScript } from "../../../lib/stepdsl"
import { mapTicket } from "../../../lib/mapping"

export default function TicketPage() {
  const [pa,setPa]=useState(5)
  const [pc,setPc]=useState(3)
  const [n,setN]=useState(20)
  const [r,setR]=useState(74)
  const [stage,setStage]=useState(0)
  const steps=ticketScript.labels
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="枚举/方程：车票问题" skillId="math-ticket" intro={{ story: "售票记录有张数与总收入，如何推断成人与儿童票的数量？", goal: "会列方程或枚举解", steps }} hints={ticketScript.hints} variantGen={(diff)=>{
      const make=(pa:number,pc:number,n:number,r:number)=>({label:`成${pa} 童${pc} 张${n} 收${r}`,apply:()=>{setPa(pa);setPc(pc);setN(n);setR(r);setStage(0)}})
      if(diff==="easy") return [make(5,3,20,74),make(6,2,15,66)]
      if(diff==="medium") return [make(8,5,30,205),make(10,6,24,192)]
      return [make(12,7,40,388),make(15,9,50,630)]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const A = Math.floor((r - pc*n)/(pa-pc))
      const C = n - A
      if(diff==="easy"){items.push({prompt:"成人票数量是多少？",placeholder:"输入数字",check:x=>parseInt(x)===A})}
      else if(diff==="medium"){items.push({prompt:"儿童票数量是多少？",placeholder:"输入数字",check:x=>parseInt(x)===C})}
      else {items.push({prompt:"写出方程",placeholder:"如 5A+3C=74, A+C=20",check:x=>x.replace(/ /g,"")==`${pa}A+${pc}C=${r},A+C=${n}`})}
      return items
    }} onEvaluate={()=>({ correct: true, text: mapTicket(pa,pc,n,r) })}>
      <div className="controls">
        <div className="control"><label>成人票价</label><input type="number" value={pa} onChange={e=>setPa(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>儿童票价</label><input type="number" value={pc} onChange={e=>setPc(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>张数</label><input type="number" value={n} onChange={e=>setN(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>收入</label><input type="number" value={r} onChange={e=>setR(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <TicketSolver priceAdult={pa} priceChild={pc} tickets={n} revenue={r} stage={stage} />
      <Narration avatar="/icons/scale.svg" name="老师">{ticketScript.narration[stage]||""}</Narration>
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={ticketScript.durations} auto />
    </LessonRunner>
  )
}