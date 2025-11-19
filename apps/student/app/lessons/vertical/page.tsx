"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { VerticalAddSub } from "../../../components/VerticalAddSub"
import { StepPlayer } from "../../../components/StepPlayer"

export default function VerticalPage() {
  const [a,setA]=useState(456)
  const [b,setB]=useState(278)
  const [op,setOp]=useState<"+"|"-">("+")
  const [stage,setStage]=useState(0)
  const steps=["输入上下两数","选择加法或减法","读出竖式结果"]
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="竖式计算" skillId="math-vertical" intro={{ story: "用竖式一步一步计算加减。", goal: "会列竖式并读出结果", steps: steps }} hints={{ build: ["输入两数","选择加减"], map: ["点击评估","读出结果"], review: ["换一组数"] }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const res = op === "+" ? a+b : a-b
      if(diff==="easy"){items.push({prompt:"求 结果",placeholder:"输入结果",check:x=>Math.abs(parseFloat(x)-res)<1e-6})}
      else if(diff==="medium"){items.push({prompt:"把 两数 都加 10 的新结果",placeholder:"输入结果",check:x=>Math.abs(parseFloat(x)-((op==="+"?(a+10)+(b+10):(a+10)-(b+10))))<1e-6})}
      else {items.push({prompt:"解释：竖式为何要对齐位？输入 yes",placeholder:"输入yes",check:x=>x.trim().toLowerCase()==="yes"})}
      return items
    }} onEvaluate={()=>({ correct: true, text: `结果=${op==="+"?a+b:a-b}` })}>
      <div className="controls">
        <div className="control"><label>上</label><input type="number" value={a} onChange={e=>setA(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>下</label><input type="number" value={b} onChange={e=>setB(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>运算</label><select value={op} onChange={e=>setOp(e.target.value as any)}><option value="+">加</option><option value="-">减</option></select></div>
      </div>
      <VerticalAddSub a={a} b={b} op={op} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}