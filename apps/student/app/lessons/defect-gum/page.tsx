"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { DefectGumBalance } from "../../../components/DefectGumBalance"
import { defectScript } from "../../../lib/stepdsl"
import { mapDefectGum } from "../../../lib/mapping"

export default function DefectGumPage() {
  const [total, setTotal] = useState(8)
  const [defective, setDefective] = useState(7) // Fixed initial value (Bottle 8) to avoid hydration mismatch
  const [stage, setStage] = useState(0)
  const [strategy, setStrategy] = useState<"ternary" | "binary">("ternary") // "ternary" (split 3) or "binary" (split 2)

  // Dynamic Steps based on total and strategy
  const isSimple = total <= 3

  const getSteps = () => {
    if (isSimple) return ["准备：观察所有口香糖", "称重：1瓶对1瓶", "结果：找到次品"]

    if (strategy === "binary") {
      // Binary search (4 vs 4 -> 2 vs 2 -> 1 vs 1)
      return ["准备：观察所有口香糖", "第一次称：4瓶对4瓶", "第二次称：2瓶对2瓶", "第三次称：1瓶对1瓶", "结果：找到次品"]
    } else {
      // Ternary search (3 vs 3 -> 1 vs 1)
      return ["准备：观察所有口香糖", "第一次称：3瓶对3瓶", "第二次称：1瓶对1瓶", "结果：找到次品"]
    }
  }

  const steps = getSteps()
  const [viewMode, setViewMode] = useState<"sim" | "tree">("sim")

  const onStep = (i: number) => setStage(i)

  return (
    <LessonRunner
      title="分析法：找次品（天平称重）"
      skillId="math-defect-gum"
      intro={{
        story: `有${total}瓶口香糖，其中${total - 1}瓶质量相同，只有一瓶少了5粒（更轻）。`,
        goal: `用天平至少称几次能找出这瓶少的口香糖？`,
        steps: isSimple ? ["分组", "称重", "判断"] : (strategy === "binary" ? ["二分法分组(4,4)", "排除一半", "继续二分"] : ["三分法分组(3,3,2)", "排除2/3", "最后确认"])
      }}
      hints={defectScript.hints}
      variantGen={(diff) => {
        const make = (t: number, d: number, label: string) => ({
          label,
          apply: () => { setTotal(t); setDefective(d); setStage(0) }
        })
        // Variants:
        if (diff === "easy") return [make(3, 0, "3瓶 (简单)"), make(3, 2, "3瓶 (变位)"), make(8, 0, "8瓶 (标准)")]
        if (diff === "medium") return [make(8, 2, "8瓶 (位置3)"), make(8, 6, "8瓶 (位置7)"), make(9, 4, "9瓶 (满3x3)")]
        return [make(9, 0, "9瓶 (位置1)"), make(9, 8, "9瓶 (位置9)"), make(8, 5, "8瓶 (位置6)")]
      }}
      microTestGen={(diff) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") { items.push({ prompt: `有${total}瓶，至少称几次？`, placeholder: "输入次数", check: x => parseInt(x) === (isSimple ? 1 : (strategy === "binary" ? 3 : 2)) }) }
        else if (diff === "medium") { items.push({ prompt: "第一次如何分组？", placeholder: "写如 3,3,2", check: x => x.replace(/ /g, "").includes(strategy === "binary" ? "4,4" : (total === 8 ? "3,3,2" : "3,3,3")) }) }
        else { items.push({ prompt: "若天平平衡，次品在哪里？", placeholder: "输入 剩下/左/右", check: x => x.includes("剩下") }) }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: mapDefectGum() })}
    >
      <div className="flex flex-col gap-6">
        <div className="controls flex flex-wrap gap-4 items-end bg-slate-50 p-4 rounded-lg">
          <div className="control flex flex-col gap-1">
            <label className="text-sm text-slate-500 font-bold">总瓶数</label>
            <div className="text-lg font-mono font-bold text-slate-700">{total}</div>
          </div>
          <div className="control flex flex-col gap-1">
            <label className="text-sm text-slate-500 font-bold">次品位置 (1-{total})</label>
            <input
              type="number"
              className="border-2 border-slate-200 rounded-lg px-3 py-1 text-lg font-mono w-24 focus:border-blue-500 outline-none"
              value={defective + 1}
              onChange={e => {
                const val = Math.max(1, Math.min(total, parseInt(e.target.value || "1")))
                setDefective(val - 1)
                setStage(0)
              }}
            />
          </div>

          {/* Strategy Selector */}
          {!isSimple && (
            <div className="control flex flex-col gap-1 ml-4 border-l pl-4 border-slate-200">
              <label className="text-sm text-slate-500 font-bold">策略选择</label>
              <div className="flex bg-white border border-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => { setStrategy("ternary"); setStage(0); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${strategy === 'ternary' ? 'bg-green-100 text-green-700' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  三分法 (最优)
                </button>
                <button
                  onClick={() => { setStrategy("binary"); setStage(0); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${strategy === 'binary' ? 'bg-orange-100 text-orange-700' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  二分法 (普通)
                </button>
              </div>
            </div>
          )}

          <div className="flex bg-white border border-slate-200 p-1 rounded-lg ml-auto">
            <button
              onClick={() => setViewMode("sim")}
              className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${viewMode === 'sim' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              天平模拟
            </button>
            <button
              onClick={() => setViewMode("tree")}
              className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${viewMode === 'tree' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              逻辑树图
            </button>
          </div>
        </div>

        <DefectGumBalance defective={defective} stage={stage} total={total} mode={viewMode} strategy={strategy} />

        <Narration avatar="/icons/scale.svg" name="老师">
          {stage === 0 && `这里有${total}瓶口香糖，其中第${defective + 1}瓶是次品（更轻）。我们需要通过称重把它找出来。`}
          {stage === 1 && (isSimple ? "将1号和2号放在天平两端。" : (strategy === "binary" ? "将8瓶分为两组，每组4瓶，分别放在天平两端。" : `将1-3号放在左盘，4-6号放在右盘。这是最高效的分组方法。`))}
          {stage === 2 && (isSimple ? "根据天平状态判断次品。" : (strategy === "binary" ? "根据第一次结果，我们排除了4瓶。现在对剩下的4瓶继续分组（2对2）。" : "根据第一次的结果，我们缩小了范围。现在对可疑组进行第二次称重（1对1）。"))}
          {stage === 3 && (strategy === "binary" ? "最后剩下2瓶，称一次就能找到次品。" : "找到了！次品就是这瓶。")}
          {stage === 4 && "找到了！次品就是这瓶。"}
        </Narration>

        <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
      </div>
    </LessonRunner>
  )
}