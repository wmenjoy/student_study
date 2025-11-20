"use client"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"

export default function LogicWritersPage() {
  return (
    <LessonRunner
      title="逻辑家庭推理"
      skillId="reasoning-logic-writers"
      intro={{
        story: "我从图书馆借了一本推理书，书里说：某一家人都是文学爱好者，他们家在自我介绍时，出现了这些亲属称谓——祖父、祖母、两个父亲、两个母亲、两个丈夫、一个妻子、一个儿子、一个女儿、一个女婿。请你判断这些称谓中哪些可能是同一个人，并据此求出这家共有多少人。",
        goal: "读清背景→识别称谓重叠→按“人”计数，得出总人数",
        steps: ["抄下称谓清单", "找出可以重叠的称谓（如父亲与丈夫可能是同一人）", "画出三代关系简图", "按人而非称谓计数"]
      }}
      hints={{
        build: ["逐条读清题目背景，不要漏掉数量词（例如‘两个父亲’）", "把‘称谓’转成‘可能是谁’，用不同颜色标记重叠"],
        map: ["用三代关系图：祖父/祖母→父母辈→儿女辈/女婿", "同一人可能承担多个称谓，避免重复计数"],
        microtest: ["先完成分组与关系图，再填写答案"],
        review: ["合并重叠后按人计数得到总人数", "说清你是如何判断同一人的"]
      }}
      microTestGen={(diff) => {
        const items: Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }> = []
        items.push({ prompt: "这家共有几个人？", placeholder: "输入数字", check: v => v.trim() === "7" })
        items.push({ prompt: "题干中提到‘父亲’共有几位？", placeholder: "输入数字", check: v => v.trim() === "2" })
        items.push({ prompt: "题干中提到‘母亲’共有几位？", placeholder: "输入数字", check: v => v.trim() === "2" })
        items.push({ prompt: "写出你的重叠关系推理一句话", placeholder: "例如：丈夫与父亲可能是同一人", check: v => v.trim().length >= 8 })
        return items
      }}
      onEvaluate={() => ({ correct: true, text: "采用按人计数并合并重叠关系，得到总人数为 7。" })}
    >
      <div className="intro-block">
        <div className="intro-title">题目原文</div>
        <div className="card">
          <div className="card-desc">我从图书馆借了一些书，其中一本书中写道：有一个家庭里，成员在介绍自己时出现了如下称谓——祖父、祖母、两个父亲、两个母亲、两个丈夫、一个妻子、一个儿子、一个女儿、一个女婿。请解释这些称谓如何同时成立，并求出这个家庭共有多少人。</div>
          <div className="hint">提示：家里共有 7 个人。研究亲属关系的重叠有助于找到答案。</div>
        </div>
      </div>
      <div className="intro-block" style={{ marginTop: 8 }}>
        <div className="intro-title">称谓清单</div>
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
          <div className="card-desc">祖父 × 1</div>
          <div className="card-desc">祖母 × 1</div>
          <div className="card-desc">父亲 × 2</div>
          <div className="card-desc">母亲 × 2</div>
          <div className="card-desc">丈夫 × 2</div>
          <div className="card-desc">妻子 × 1</div>
          <div className="card-desc">儿子 × 1</div>
          <div className="card-desc">女儿 × 1</div>
          <div className="card-desc">女婿 × 1</div>
        </div>
      </div>
      <Narration avatar="/mascots/cat.svg" name="推理老师">
        先把称谓看成“角色”，再判断哪些可能来自同一人；例如丈夫往往也是某个孩子的父亲。完成重叠合并后，再按“人”来计数。
      </Narration>
    </LessonRunner>
  )
}