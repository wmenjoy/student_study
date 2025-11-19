"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { SentenceOrder } from "../../../components/SentenceOrder"
import { StepPlayer } from "../../../components/StepPlayer"

export default function SentenceOrderPage() {
  const base = ["小明", "在操场", "快乐地", "奔跑"]
  const [parts,setParts]=useState(base)
  const [stage,setStage]=useState(0)
  const steps=["认识词语块","按语序点击排列","读出完整句子"]
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="句子重排" skillId="cn-sentence-order" intro={{ story: "用词语块拼出完整句子。", goal: "会按语序重排句子", steps: steps }} hints={{ build: ["点击词语块加入句子"], map: ["读出完整句子"], review: ["换一个句子再试"] }} variantGen={(diff)=>{
      const make=(p:string[])=>({label:p.join("·"),apply:()=>setParts(p)})
      if(diff==="easy") return [make(["小花","在花园","快乐地","唱歌"]), make(["小熊","在森林","开心地","玩耍"]), make(base)]
      if(diff==="medium") return [make(["小明","早上","在操场","跑步"]), make(["我们","下午","在教室","学习"]), make(["她","在图书馆","认真地","看书"]), make(["老师","在讲台","耐心地","讲解"]) ]
      return [make(["春天","在田野","悄悄地","来临"]), make(["孩子们","在操场","快乐地","游戏"]), make(["雨后","天空","慢慢地","放晴"]), make(["远方","传来","清脆的","铃声"]), make(["小鹿","在林间","轻轻地","跳跃"]) ]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const target = parts.join("")
      if(diff==="easy"){items.push({prompt:"把句子写出来",placeholder:"输入句子",check:x=>x.replaceAll(" ","")===target})}
      else if(diff==="medium"){items.push({prompt:"把‘快乐地’换成‘高兴地’后写出句子",placeholder:"输入句子",check:x=>x.replaceAll(" ","")===target.replace("快乐地","高兴地")})}
      else {items.push({prompt:"在句末加‘。’写出句子",placeholder:"输入句子",check:x=>x.replaceAll(" ","")===target+"。"})}
      return items
    }} onEvaluate={()=>({ correct: true, text: `句子：${parts.join("")}` })}>
      <SentenceOrder parts={parts} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}