"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { ChickenRabbitAssume } from "../../../components/ChickenRabbitAssume"
import { assumeScript } from "../../../lib/stepdsl"
import { mapChickenRabbit } from "../../../lib/mapping"

export default function ChickenRabbitPage() {
  const [heads,setHeads]=useState(30)
  const [legs,setLegs]=useState(82)
  const [stage,setStage]=useState(0)
  const steps=assumeScript.labels
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="假设法：鸡兔同笼" skillId="math-chicken-rabbit" intro={{ story: "农场统计鸡和兔，已知头与腿，如何快速求数量？", goal: "会用全鸡假设法求鸡兔数量", steps }} hints={assumeScript.hints} variantGen={(diff)=>{
      const make=(h:number,l:number)=>({label:`头${h} 腿${l}`,apply:()=>{setHeads(h);setLegs(l);setStage(0)}})
      if(diff==="easy") return [make(10,28),make(20,52),make(24,64)]
      if(diff==="medium") return [make(30,82),make(35,92),make(40,112)]
      return [make(50,136),make(60,168),make(72,200)]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const allChickenLegs = heads*2
      const extra = Math.max(0, legs - allChickenLegs)
      const rabbits = Math.floor(extra/2)
      const chickens = heads - rabbits
      if(diff==="easy"){items.push({prompt:"全鸡假设腿数是多少？",placeholder:"输入数字",check:x=>parseInt(x)===allChickenLegs})}
      else if(diff==="medium"){items.push({prompt:"多余腿数是多少？",placeholder:"输入数字",check:x=>parseInt(x)===extra})}
      else {items.push({prompt:"鸡与兔的数量？写如 鸡x 兔y",placeholder:"鸡x 兔y",check:x=>x.replaceAll(" ","")===`鸡${chickens}兔${rabbits}`})}
      return items
    }} onEvaluate={()=>({ correct: true, text: mapChickenRabbit(heads,legs) })}>
      <div className="controls">
        <div className="control"><label>头</label><input type="number" value={heads} onChange={e=>setHeads(parseFloat(e.target.value||"0"))} /></div>
        <div className="control"><label>腿</label><input type="number" value={legs} onChange={e=>setLegs(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <ChickenRabbitAssume heads={heads} legs={legs} stage={stage} />
      <Narration avatar="/icons/scale.svg" name="老师">{assumeScript.narration[stage]||""}</Narration>
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={assumeScript.durations} auto />
    </LessonRunner>
  )
}