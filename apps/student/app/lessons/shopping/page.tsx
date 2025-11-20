"use client"
import { useState, useRef, useEffect } from "react"
import { ShoppingViz } from "../../../components/ShoppingViz"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function ShoppingPage() {
  const [tableCount, setTableCount] = useState(6)
  const [chairCount, setChairCount] = useState(5)
  const [tableDiff, setTableDiff] = useState(30)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate prices
  const chairPrice = 25
  const tablePrice = chairPrice + tableDiff
  const total = tablePrice * tableCount + chairPrice * chairCount

  const steps = [
    "步骤1：理解题意——桌子和椅子的数量",
    "步骤2：标出价格——桌子比椅子贵",
    "步骤3：价格对比——看差价",
    "步骤4：列方程——求出价格"
  ]

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => { return () => clearTimer() }, [])

  const onStep = (i: number) => {
    setStage(i)
    clearTimer()
  }

  const getNarrationText = () => {
    if (stage === 0) return `买了${tableCount}张桌子和${chairCount}把椅子，一共花了多少钱呢？`
    if (stage === 1) return "每张桌子和每把椅子的价格是多少？桌子比椅子贵！"
    if (stage === 2) return `桌子比椅子贵${tableDiff}元，我们来对比一下价格！`
    if (stage === 3) return "设椅子的价格为x，用方程算出答案！"
    return "试试改变数量和差价，再算一次！"
  }

  return (
    <LessonRunner
      title="购物问题"
      skillId="math-shopping"
      intro={{
        story: "学校购买桌椅，桌子比椅子贵一些。知道总价和差价，能算出各自的价格吗？",
        goal: "用方程思想解决购物问题",
        steps: ["设定数量和差价", "观察价格关系", "列方程求解"]
      }}
      hints={{
        build: ["输入桌子和椅子的数量", "输入价格差"],
        map: ["点击评估", "读出各自的价格"],
        review: ["设椅子x元，桌子(x+差)元", "列方程求解"]
      }}
      variantGen={(difficulty) => {
        const make = (tc: number, cc: number, diff: number) => ({
          label: `${tc}桌${cc}椅,差${diff}元`,
          apply: () => { setTableCount(tc); setChairCount(cc); setTableDiff(diff); setStage(0) }
        })
        if (difficulty === "easy") return [make(6, 5, 30), make(4, 3, 20), make(5, 4, 25)]
        if (difficulty === "medium") return [make(8, 6, 35), make(7, 5, 40), make(10, 8, 45)]
        return [make(12, 10, 50), make(15, 12, 60), make(10, 15, 55)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>

        if (difficulty === "easy") {
          items.push({
            prompt: `椅子多少元？`,
            placeholder: "输入价格",
            check: v => Math.abs(parseFloat(v) - chairPrice) < 0.1
          })
          items.push({
            prompt: `桌子多少元？`,
            placeholder: "输入价格",
            check: v => Math.abs(parseFloat(v) - tablePrice) < 0.1
          })
        } else if (difficulty === "medium") {
          items.push({
            prompt: `如果差价改为${tableDiff + 10}元，椅子仍是${chairPrice}元，桌子多少元？`,
            placeholder: "输入价格",
            check: v => Math.abs(parseFloat(v) - (chairPrice + tableDiff + 10)) < 0.1
          })
          items.push({
            prompt: `买${tableCount + 2}张桌子和${chairCount}把椅子，总价多少？`,
            placeholder: "输入总价",
            check: v => Math.abs(parseFloat(v) - (tablePrice * (tableCount + 2) + chairPrice * chairCount)) < 0.1
          })
        } else {
          items.push({
            prompt: `3支钢笔4支圆珠笔共26元，钢笔比圆珠笔贵2元，圆珠笔多少元？`,
            placeholder: "输入价格",
            check: v => Math.abs(parseFloat(v) - 2) < 0.1
          })
          items.push({
            prompt: `上题钢笔多少元？`,
            placeholder: "输入价格",
            check: v => Math.abs(parseFloat(v) - 4) < 0.1
          })
        }
        return items
      }}
      onEvaluate={() => ({
        correct: true,
        text: `设椅子x元，桌子(x+${tableDiff})元。${tableCount}(x+${tableDiff})+${chairCount}x=${total}，椅子${chairPrice}元，桌子${tablePrice}元`
      })}
    >
      <Narration avatar="/mascots/bear.svg" name="智慧熊">
        {getNarrationText()}
      </Narration>

      <div className="controls flex flex-wrap gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-red-600 font-bold">桌子数量</label>
          <input
            type="number"
            className="border-2 border-red-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-red-500 outline-none"
            value={tableCount}
            onChange={e => { setTableCount(Math.max(1, parseInt(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-blue-600 font-bold">椅子数量</label>
          <input
            type="number"
            className="border-2 border-blue-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={chairCount}
            onChange={e => { setChairCount(Math.max(1, parseInt(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-amber-600 font-bold">价格差（元）</label>
          <input
            type="number"
            className="border-2 border-amber-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-amber-500 outline-none"
            value={tableDiff}
            onChange={e => { setTableDiff(Math.max(1, parseInt(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
      </div>

      <ShoppingViz
        tableCount={tableCount}
        chairCount={chairCount}
        tableDiff={tableDiff}
        stage={stage}
      />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      {/* Problem variations */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">变形练习</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>钢笔圆珠笔:</strong> 3支钢笔4支圆珠笔共26元，钢笔比圆珠笔贵2元</p>
          <p><strong>保温瓶茶杯:</strong> 5个保温瓶10个茶杯共90元，保温瓶是茶杯价的4倍</p>
          <p><strong>苹果和梨:</strong> 买4千克苹果和3千克梨共23元，苹果比梨贵1元/千克</p>
        </div>
      </div>

      {/* Key formula */}
      {stage >= 3 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">解题方法</h3>
          <div className="text-green-700 space-y-1">
            <p className="font-mono">1. 设便宜的为x</p>
            <p className="font-mono">2. 贵的为(x+差价)</p>
            <p className="font-mono">3. 数量A×(x+差)+数量B×x=总价</p>
          </div>
          <div className="text-sm text-green-600 mt-2">
            💡 消除差价法：假设全买便宜的，再补上差价！
          </div>
        </div>
      )}
    </LessonRunner>
  )
}
