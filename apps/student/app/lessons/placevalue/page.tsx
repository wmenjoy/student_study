"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { PlaceValueBlocks } from "../../../components/PlaceValueBlocks"
import { StepPlayer } from "../../../components/StepPlayer"

export default function PlaceValuePage() {
  const [v,setV]=useState(345)
  const [stage,setStage]=useState(0)
  const steps=["输入三位数","观察百十个的数量","读出分解表达"]
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="位值分解" skillId="math-placevalue" intro={{ story: "用方块表示百十个，认识进位与分解。", goal: "能把数分解为百十个", steps: steps }} hints={{ build: ["输入一个整数"], map: ["读出‘百×100 + 十×10 + 个’"], review: ["尝试换一个数再分解"] }} microTestGen={(diff)=>{
      const h=Math.floor(v/100), t=Math.floor((v%100)/10), o=v%10
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      if(diff==="easy"){items.push({prompt:"求 百 的数量",placeholder:"输入数量",check:x=>Math.abs(parseFloat(x)-h)<1e-6});items.push({prompt:"求 十 的数量",placeholder:"输入数量",check:x=>Math.abs(parseFloat(x)-t)<1e-6})}
      else if(diff==="medium"){items.push({prompt:"写出 分解 表达式",placeholder:"如 3×100+4×10+5",check:x=>x.replaceAll(" ","")===`${h}×100+${t}×10+${o}`})}
      else {items.push({prompt:`把 数值 改为 ${v+110} 的 百 数量`,placeholder:"输入数量",check:x=>Math.abs(parseFloat(x)-Math.floor((v+110)/100))<1e-6})}
      return items
    }} onEvaluate={()=>({ correct: true, text: `分解: ${Math.floor(v/100)}×100 + ${Math.floor((v%100)/10)}×10 + ${v%10}` })}>
      <div className="controls"><div className="control"><label>数值</label><input type="number" value={v} onChange={e=>setV(parseFloat(e.target.value||"0"))} /></div></div>
      <PlaceValueBlocks value={v} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}