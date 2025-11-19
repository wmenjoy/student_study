"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { GroupSumPairs } from "../../../components/GroupSumPairs"
import { groupScript } from "../../../lib/stepdsl"
import { mapGroupSum } from "../../../lib/mapping"

export default function GroupSumPage() {
  const [nums,setNums]=useState<number[]>([1,2,3,4,5,6,7,8,9,10])
  const [target,setTarget]=useState(11)
  const [stage,setStage]=useState(0)
  const steps=groupScript.labels
  const onStep=(i:number)=> setStage(i)
  const parseNums=(s:string)=> s.split(/[,\s]+/).filter(x=>x.length>0).map(x=>parseInt(x))
  return (
    <LessonRunner title="枚举/配对：组数求和" skillId="math-group-sum" intro={{ story: "将数列配成和相同的组，快速求解总和。", goal: "会按目标和进行配对并统计对数", steps }} hints={groupScript.hints} variantGen={(diff)=>{
      const make=(arr:number[],t:number)=>({label:`${arr.join(',')} 目标${t}`,apply:()=>{setNums(arr);setTarget(t);setStage(0)}})
      if(diff==="easy") return [make([1,2,3,4,5,6,7,8,9,10],11),make([2,4,6,8,10,12,14,16,18],20)]
      if(diff==="medium") return [make([3,6,9,12,15,18],21),make([2,5,8,11,14,17,20,23,26],28)]
      return [make([2,4,6,8,10,12,14,16,18,20,22,24],26),make([1,3,5,7,9,11,13,15,17,19],20)]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const arr=nums
      const t=target
      const pairs=()=>{const used=new Set<number>();const ps:number[][]=[];for(let i=0;i<arr.length;i++){if(used.has(i))continue;for(let j=i+1;j<arr.length;j++){if(used.has(j))continue;if(arr[i]+arr[j]===t){ps.push([arr[i],arr[j]]);used.add(i);used.add(j);break}}}return ps}
      if(diff==="easy"){items.push({prompt:"配成的对数是多少？",placeholder:"输入数字",check:x=>parseInt(x)===pairs().length})}
      else if(diff==="medium"){items.push({prompt:"随意写出一组配对",placeholder:"如 3+8",check:x=>{const s=x.replaceAll(' ','').split('+');if(s.length!==2)return false;const a=parseInt(s[0]),b=parseInt(s[1]);return a+b===t && arr.includes(a)&&arr.includes(b)}})}
      else {items.push({prompt:"写出所有配对（逗号分隔）",placeholder:"如 1+10,2+9,...",check:x=>{const ex=pairs().map(p=>p.join('+')).join(',');return x.replaceAll(' ','')===ex}})}
      return items
    }} onEvaluate={()=>({ correct: true, text: mapGroupSum(nums,target) })}>
      <div className="controls" style={{flexWrap:'wrap'}}>
        <div className="control"><label>数列</label><input type="text" defaultValue={nums.join(',')} onBlur={e=>setNums(parseNums(e.target.value||''))} /></div>
        <div className="control"><label>目标和</label><input type="number" value={target} onChange={e=>setTarget(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <GroupSumPairs nums={nums} target={target} stage={stage} />
      <Narration avatar="/icons/number-line.svg" name="老师">{groupScript.narration[stage]||""}</Narration>
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={groupScript.durations} auto />
    </LessonRunner>
  )
}