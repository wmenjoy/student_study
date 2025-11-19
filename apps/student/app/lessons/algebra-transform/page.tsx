"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { AlgebraTransform } from "../../../components/AlgebraTransform"

export default function AlgebraTransformPage() {
  const [a,setA]=useState(237)
  const [b,setB]=useState(37)
  const [c,setC]=useState(56)
  const [stage,setStage]=useState(0)
  const steps=["题面","等式性质","去括号","按顺序计算","读出结果"]
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="括号转化：a−(b+c)" skillId="math-algebra-transform" intro={{ story: "把含括号的式子转化成分步计算。", goal: "会应用 a−(b+c)=a−b−c", steps }} hints={{ build: ["输入 a,b,c"], map: ["先去括号再分步算"], review: ["换一组数再试"] }} variantGen={(diff)=>{
      const make=(x:number,y:number,z:number)=>({label:`${x}−(${y}+${z})`,apply:()=>{setA(x);setB(y);setC(z);setStage(0)}})
      if(diff==="easy") return [make(120,20,30),make(200,40,50),make(150,30,20)]
      if(diff==="medium") return [make(237,37,56),make(356,78,64),make(420,120,85)]
      return [make(1000,199,288),make(876,321,234),make(750,265,199)]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const inter = a - b
      const res = a - b - c
      if(diff==="easy"){items.push({prompt:"去括号后的式子？",placeholder:"写如 a-b-c",check:x=>x.replaceAll(" ","")===`${a}-${b}-${c}`})}
      else if(diff==="medium"){items.push({prompt:"先算哪一步？",placeholder:"写如 a-b",check:x=>x.replaceAll(" ","").toLowerCase()==="a-b"})}
      else {items.push({prompt:"中间结果与最终结果？",placeholder:"写如 200 和 144",check:x=>{const s=x.replaceAll(" ","").split("和");return s.length===2 && parseInt(s[0])===inter && parseInt(s[1])===res}})}
      return items
    }} onEvaluate={()=>({ correct: true, text: `结果=${a-b-c}` })}>
      <div className="controls">
        <div className="control"><label>a</label><input type="number" value={a} onChange={e=>setA(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>b</label><input type="number" value={b} onChange={e=>setB(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>c</label><input type="number" value={c} onChange={e=>setC(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <AlgebraTransform a={a} b={b} c={c} stage={stage} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}