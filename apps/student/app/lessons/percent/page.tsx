"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { PercentGrid } from "../../../components/PercentGrid"

export default function PercentPage() {
  const [p,setP]=useState(25)
  return (
    <LessonRunner title="百分网格" skillId="math-percent" intro={{ story: "用百格涂色理解百分与小数。", goal: "会读百分并与小数互转", steps: ["设置百分值","观察涂色格数","读出小数与分数"] }} hints={{ build: ["输入百分值"], map: ["读出小数与分数"], review: ["换一个值再试"] }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      if(diff==="easy"){items.push({prompt:"小数是多少？",placeholder:"输入小数",check:x=>x.trim()===(p/100).toFixed(2)})}
      else if(diff==="medium"){items.push({prompt:`把 百分 改为 ${p+10} 的小数`,placeholder:"输入小数",check:x=>x.trim()===((p+10)/100).toFixed(2)})}
      else {items.push({prompt:"分数是多少？（分母为100）",placeholder:"输入分数如 25/100",check:x=>x.trim()==`${p}/100`})}
      return items
    }} onEvaluate={()=>({ correct: true, text: `小数 ${(p/100).toFixed(2)} 分数 ${p}/100` })}>
      <div className="controls"><div className="control"><label>百分</label><input type="number" value={p} onChange={e=>setP(parseFloat(e.target.value||"0"))} /></div></div>
      <PercentGrid percent={p} />
    </LessonRunner>
  )
}