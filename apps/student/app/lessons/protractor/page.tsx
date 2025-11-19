"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { Protractor } from "../../../components/Protractor"

export default function ProtractorPage() {
  const [d,setD]=useState(60)
  return (
    <LessonRunner title="量角器读数" skillId="math-protractor" intro={{ story: "用量角器读角度。", goal: "能读出角度并做加减", steps: ["设置角度","观察指针","读出数值"] }} hints={{ build: ["输入角度"], map: ["读出角度数值"], review: ["做一次角度加减"] }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      if(diff==="easy"){items.push({prompt:"当前角度是多少？",placeholder:"输入角度",check:x=>Math.abs(parseFloat(x)-d)<1e-6})}
      else if(diff==="medium"){items.push({prompt:`把角度加 15 的新角度`,placeholder:"输入角度",check:x=>Math.abs(parseFloat(x)-(d+15))<1e-6})}
      else {items.push({prompt:`把角度减 20 的新角度`,placeholder:"输入角度",check:x=>Math.abs(parseFloat(x)-(d-20))<1e-6})}
      return items
    }} onEvaluate={()=>({ correct: true, text: `角度=${d}°` })}>
      <div className="controls"><div className="control"><label>角度</label><input type="number" value={d} onChange={e=>setD(parseFloat(e.target.value||"0"))} /></div></div>
      <Protractor degrees={d} />
    </LessonRunner>
  )
}