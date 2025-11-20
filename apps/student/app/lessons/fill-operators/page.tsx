"use client"
import { useState, useRef, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { FillOperators } from "../../../components/FillOperators"
import { solveExpression } from "../../../lib/mathSolver"

export default function FillOperatorsPage() {
    const [numbers, setNumbers] = useState([1, 2, 3, 4])
    const [target, setTarget] = useState(0)
    const [stage, setStage] = useState(0)
    const [solved, setSolved] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const steps = [
        "步骤1：观察题目——看看数字和目标结果",
        "步骤2：动手尝试——填入符号试一试",
        "步骤3：揭晓答案——看看机器猫老师的百宝袋里有哪些解法"
    ]

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }

    useEffect(() => { return () => clearTimer() }, [])

    // Reset solved state when problem changes
    useEffect(() => {
        setSolved(false)
    }, [numbers, target])

    const onStep = (i: number) => {
        setStage(i)
        clearTimer()
    }

    const handleSolve = (correct: boolean) => {
        if (correct) {
            setSolved(true)
            // Optional: Auto-advance or show praise
        }
    }

    return (
        <LessonRunner
            title="巧填运算符号"
            skillId="math-fill-operators"
            intro={{
                story: "机器猫老师带来了一道有趣的数学谜题！我们需要在数字之间填上 +、-、×、÷，让等式成立。",
                goal: "锻炼逆向思维和运算能力",
                steps: ["观察数字特征", "大胆尝试组合", "寻找多种解法"]
            }}
            hints={{
                build: ["先看结果是变大还是变小", "乘法能让数变大，除法能变小"],
                map: ["试试把数字分成两组", "注意运算顺序哦"],
                review: ["还有没有别的填法？", "括号能不能帮上忙？"]
            }}
            variantGen={(diff) => {
                const make = (nums: number[], tgt: number, label: string) => ({
                    label,
                    apply: () => { setNumbers(nums); setTarget(tgt); setStage(0); setSolved(false) }
                })
                if (diff === "easy") return [
                    make([1, 2, 3, 4], 0, "1 2 3 4 = 0"),
                    make([1, 2, 3, 4], 10, "1 2 3 4 = 10"),
                    make([5, 5, 5, 5], 0, "5 5 5 5 = 0")
                ]
                if (diff === "medium") return [
                    make([3, 3, 3, 3], 1, "3 3 3 3 = 1"),
                    make([3, 3, 3, 3], 2, "3 3 3 3 = 2"),
                    make([3, 3, 3, 3], 3, "3 3 3 3 = 3"),
                    make([3, 3, 3, 3], 4, "3 3 3 3 = 4"),
                    make([3, 3, 3, 3], 5, "3 3 3 3 = 5")
                ]
                return [
                    make([4, 4, 4, 4], 24, "4 4 4 4 = 24"),
                    make([9, 9, 9, 9], 9, "9 9 9 9 = 9"),
                    make([1, 2, 3, 4, 5], 1, "1 2 3 4 5 = 1")
                ]
            }}
            microTestGen={(diff) => {
                const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
                // Helper to check if expression evaluates to target
                const checkExpr = (expr: string, tgt: number) => {
                    try {
                        // Basic sanitization: only allow digits and operators
                        if (!/^[\d\s\+\-\*\/\(\)]+$/.test(expr)) return false
                        // eslint-disable-next-line no-new-func
                        const res = new Function(`return ${expr}`)()
                        return Math.abs(res - tgt) < 1e-6
                    } catch { return false }
                }

                if (diff === "easy") {
                    items.push({
                        prompt: "请写出一个等于 0 的算式 (用 1,2,3)",
                        placeholder: "例如: 1+2-3",
                        check: v => checkExpr(v, 0) && v.includes("1") && v.includes("2") && v.includes("3")
                    })
                } else if (diff === "medium") {
                    items.push({
                        prompt: "用四个 3 算出 6",
                        placeholder: "例如: 3+3+3-3",
                        check: v => checkExpr(v, 6) && (v.match(/3/g) || []).length >= 4
                    })
                } else {
                    items.push({
                        prompt: "用 4 个 4 算出 24",
                        placeholder: "输入算式",
                        check: v => checkExpr(v, 24) && (v.match(/4/g) || []).length >= 4
                    })
                }
                return items
            }}
            onEvaluate={() => ({ correct: solved, text: `目标: ${numbers.join(" ")} = ${target}` })}
        >
            <Narration avatar="/mascots/cat.svg" name="机器猫老师">
                {stage === 0 && `小朋友，这里有几个数字 ${numbers.join(", ")}，我们要想办法让它们变成 ${target}。快动动脑筋，在圆圈里填上运算符号吧！如果卡住了，可以点击“🧠 思路”看看锦囊哦！`}
                {stage === 1 && !solved && "别着急，多试几次！你可以先算算前两个数，再和后面的数组合。"}
                {stage === 1 && solved && "哇！你太厉害了！居然这么快就解出来了！要不要看看还有没有其他解法？"}
                {stage === 2 && "看！我的百宝袋里还有这些解法。有些解法可能需要用到括号哦，不过我们今天主要练习填符号。"}
            </Narration>

            <FillOperators numbers={numbers} target={target} stage={stage} onSolve={handleSolve} />

            <StepPlayer steps={steps} title="解题步骤" index={stage} onIndexChange={onStep} />
        </LessonRunner>
    )
}

