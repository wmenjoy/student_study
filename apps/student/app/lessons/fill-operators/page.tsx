"use client"
import { useState, useRef, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { FillOperators } from "../../../components/FillOperators"

export default function FillOperatorsPage() {
    const [numbers, setNumbers] = useState([1, 2, 3, 4])
    const [target, setTarget] = useState(0)
    const [stage, setStage] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const steps = [
        "步骤1：理解题目——分析数字和目标",
        "步骤2：思考策略——找出可能的组合",
        "步骤3：验证答案——检查结果是否正确"
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

    return (
        <LessonRunner
            title="填写运算符号"
            skillId="math-fill-operators"
            intro={{
                story: "给定几个数字和一个目标结果，通过填写运算符号使等式成立。",
                goal: "培养逻辑推理和运算能力",
                steps: ["理解题目", "分析策略", "验证答案"]
            }}
            hints={{
                build: ["观察数字大小", "思考目标结果"],
                map: ["尝试不同组合", "注意运算顺序"],
                review: ["检查计算结果", "寻找其他解法"]
            }}
            variantGen={(diff) => {
                const make = (nums: number[], tgt: number, label: string) => ({
                    label,
                    apply: () => { setNumbers(nums); setTarget(tgt); setStage(0) }
                })
                if (diff === "easy") return [
                    make([1, 2, 3, 4], 0, "1 2 3 4 = 0"),
                    make([2, 3, 4, 5], 0, "2 3 4 5 = 0"),
                    make([1, 2, 3, 4], 10, "1 2 3 4 = 10")
                ]
                if (diff === "medium") return [
                    make([9, 8, 7, 6, 5, 4, 3, 2, 1], 35, "9 8 7 6 5 4 3 2 1 = 35"),
                    make([5, 5, 5, 5], 5, "5 5 5 5 = 5"),
                    make([3, 3, 3, 3], 6, "3 3 3 3 = 6")
                ]
                return [
                    make([3, 3, 3, 3], 0, "3 3 3 3 = 0"),
                    make([3, 3, 3, 3], 1, "3 3 3 3 = 1"),
                    make([3, 3, 3, 3], 2, "3 3 3 3 = 2"),
                    make([3, 3, 3, 3], 3, "3 3 3 3 = 3"),
                    make([3, 3, 3, 3], 4, "3 3 3 3 = 4")
                ]
            }}
            microTestGen={(diff) => {
                const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
                if (diff === "easy") {
                    items.push({ prompt: "找出一个使 1 2 3 4 = 0 成立的解法", placeholder: "例如：(1+4)-(2+3)", check: v => v.length > 5 })
                } else if (diff === "medium") {
                    items.push({ prompt: "找出一个使 5 5 5 5 = 5 成立的解法", placeholder: "输入表达式", check: v => v.length > 5 })
                } else {
                    items.push({ prompt: "找出一个使 3 3 3 3 = 6 成立的解法", placeholder: "输入表达式", check: v => v.length > 5 })
                }
                return items
            }}
            onEvaluate={() => ({ correct: true, text: `目标: ${numbers.join(" ")} = ${target}` })}
        >
            <Narration avatar="/icons/number-line.svg" name="数学老师">
                {stage === 0 && `给定数字 ${numbers.join(", ")}，目标结果是 ${target}。你能找出合适的运算符号吗？`}
                {stage === 1 && "思考策略：可以尝试加减法组合，或者乘除法分组。"}
                {stage === 2 && "验证你的答案，确保计算结果正确！"}
            </Narration>

            <FillOperators numbers={numbers} target={target} stage={stage} />

            <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
        </LessonRunner>
    )
}
