"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { PunctuationPractice } from "../../../components/PunctuationPractice"
import { StepPlayer } from "../../../components/StepPlayer"

export default function PunctuationPage() {
  const [text,setText]=useState("今天阳光很好_我们去公园_一起放风筝_")
  const [answers,setAnswers]=useState(["，","，","。"])
  const [stage,setStage]=useState(0)
  const steps=["看句子停顿","选择合适标点","读出完整句子"]
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="标点练习" skillId="cn-punctuation" intro={{ story: "给句子加上合适的标点。", goal: "会用逗号句号等标点", steps: steps }} hints={{ build: ["观察停顿位置"], map: ["选择标点并读出句子"], review: ["换一个句子再试"] }} variantGen={(diff)=>{
      const make=(t:string,a:string[])=>({label:t.replace("_","□"),apply:()=>{setText(t);setAnswers(a)}})
      if(diff==="easy") return [make("小鸟在树上唱歌_声音真好听_", ["，","。"]), make(text, answers)]
      if(diff==="medium") return [make("下雨了_我们还是出发吧_带上雨衣_", ["，","。","。"]), make("快看_彩虹出来了_七种颜色真漂亮_", ["，","，","。"])]
      return [make("同学们_请排好队_不要推挤_保持安静_", ["，","，","，","。"]), make("春风吹来_花儿摇曳_蜂蝶飞舞_", ["，","，","。"])]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const target = text.split("_").map((chunk,i)=> chunk + (i<answers.length?answers[i]:"")) .join("")
      if(diff==="easy"){items.push({prompt:"把句子写出来",placeholder:"输入句子",check:x=>x.replace(" ","")===target})}
      else if(diff==="medium"){items.push({prompt:"把最后一个句号改成惊叹号写出来",placeholder:"输入句子",check:x=>x.replace(" ","")===target.replace(/。$/,"！")})}
      else {items.push({prompt:"把第一个逗号改成分号写出来",placeholder:"输入句子",check:x=>x.replace(" ","")===target.replace("，","；")})}
      return items
    }} onEvaluate={()=>({ correct: true, text: "注意：逗号表示轻停，句号表示陈述句结束。" })}>
      <PunctuationPractice text={text} holes={answers.length} answers={answers} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}