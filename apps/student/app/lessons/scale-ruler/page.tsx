"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { RulerScale } from "../../../components/RulerScale"

export default function ScaleRulerPage() {
  const [m,setM]=useState(8)
  const [s,setS]=useState(5)
  return (
    <LessonRunner title="比例尺与尺子" skillId="math-scale-ruler" intro={{ story: "用比例尺把图上长度换成真实长度。", goal: "能计算实际长度", steps: ["设置图上长度","设置比例尺","读出实际长度"] }} hints={{ build: ["输入测得长度","输入比例尺"], map: ["读出‘实际长度=测得×比例’"], review: ["换一个比例再试"] }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      if(diff==="easy"){items.push({prompt:"求 实际 长度",placeholder:"输入长度",check:x=>Math.abs(parseFloat(x)-(m*s))<1e-6})}
      else if(diff==="medium"){items.push({prompt:`把比例尺改为 ${s+2} 的实际长度`,placeholder:"输入长度",check:x=>Math.abs(parseFloat(x)-(m*(s+2)))<1e-6})}
      else {items.push({prompt:`把图上长度改为 ${m+3} 的实际长度`,placeholder:"输入长度",check:x=>Math.abs(parseFloat(x)-((m+3)*s))<1e-6})}
      return items
    }} onEvaluate={()=>({ correct: true, text: `实际长度=${m*s}` })}>
      <div className="controls">
        <div className="control"><label>图上长度(cm)</label><input type="number" value={m} onChange={e=>setM(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>比例尺 1:n</label><input type="number" value={s} onChange={e=>setS(parseFloat(e.target.value||"1"))} /></div>
      </div>
      <RulerScale measured={m} scale={s} />
    </LessonRunner>
  )
}