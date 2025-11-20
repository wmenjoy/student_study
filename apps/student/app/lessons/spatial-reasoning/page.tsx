"use client"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"

export default function SpatialReasoningPage() {
  return (
    <LessonRunner
      title="空间力训练"
      skillId="reasoning-spatial"
      intro={{
        story: "通过积木想象、简单数独、天平补重三类题目，练习空间感、方向感与平衡直觉。",
        goal: "读题→想象→计算/判断，提升空间推理能力",
        steps: ["阅读题目原文", "画草图或在脑中搭建", "给出关键数字并解释理由"]
      }}
      hints={{
        build: ["积木题：分层相加", "数独：每行每列不重复", "天平：两侧总重相等"],
        map: ["把题目转换为数字表达", "列式或口算均可"],
        microtest: ["先完成心算或草图，再填写答案"],
        review: ["说清你的思路：分层/不重复/补平衡"]
      }}
      microTestGen={() => {
        return [
          { prompt: "积木阶梯三层：第1层3块、第2层2块、第3层1块，共有几块？", placeholder: "输入数字", check: v => v.trim() === "6" },
          { prompt: "4×4 数独使用的数字范围是？", placeholder: "例如：1-4", check: v => v.trim() === "1-4" },
          { prompt: "天平左侧7千克，右侧为4千克+？，求缺少的重量？", placeholder: "输入数字(千克)", check: v => v.trim() === "3" }
        ]
      }}
      onEvaluate={() => ({ correct: true, text: "积木按层相加得到6；4×4数独使用1-4；补平衡缺3千克。" })}
    >
      <div className="intro-block">
        <div className="intro-title">题目一：学积木图题</div>
        <div className="card">
          <div className="card-desc">设一个三层阶梯：第1层3块、第2层2块、第3层1块。请计算总块数并说明你的分层相加理由。</div>
        </div>
      </div>
      <div className="intro-block" style={{ marginTop: 12 }}>
        <div className="intro-title">题目二：逻辑数独</div>
        <div className="card">
          <div className="card-desc">考虑一个 4×4 的数独，每行每列数字不重复。回答本题所用数字范围，并尝试完成一个示例格。</div>
        </div>
      </div>
      <div className="intro-block" style={{ marginTop: 12 }}>
        <div className="intro-title">题目三：补平衡</div>
        <div className="card">
          <div className="card-desc">天平左侧总重为 7 千克，右侧为 4 千克加上一个未知物。求该未知物的重量使两侧平衡。</div>
        </div>
      </div>
      <Narration avatar="/mascots/bear.svg" name="空间老师">先在脑中搭建或快速画草图：积木分层求和；数独记住不重复；天平用“左右相等”来补足重量。</Narration>
    </LessonRunner>
  )
}