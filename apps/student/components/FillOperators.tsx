"use client"
import { useEffect, useState, useMemo } from "react"
import { solveExpression, getEvaluationSteps, EvalStep } from "../lib/mathSolver"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
    numbers: number[];
    target: number;
    stage?: number;
    onSolve?: (correct: boolean) => void;
}

export function FillOperators({ numbers, target, stage = 0, onSolve }: Props) {
    const [ops, setOps] = useState<string[]>(Array(numbers.length - 1).fill("?"))
    const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle")
    const [showSolutions, setShowSolutions] = useState(false)

    // Animation state
    const [isEvaluating, setIsEvaluating] = useState(false)
    const [evalSteps, setEvalSteps] = useState<EvalStep[]>([])
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    // Reset when problem changes
    useEffect(() => {
        setOps(Array(numbers.length - 1).fill("?"))
        setFeedback("idle")
        setShowSolutions(false)
        setIsEvaluating(false)
        setEvalSteps([])
        setCurrentStepIndex(0)
    }, [numbers, target])

    // Handle stage changes
    useEffect(() => {
        if (stage === 0) {
            setShowSolutions(false)
        } else if (stage === 2) {
            setShowSolutions(true)
        }
    }, [stage])

    const solutions = useMemo(() => solveExpression(numbers, target), [numbers, target])

    const cycleOp = (index: number) => {
        if (isEvaluating) return // Lock during animation
        const options = ["?", "+", "-", "×", "÷"]
        const current = ops[index]
        const next = options[(options.indexOf(current) + 1) % options.length]
        const newOps = [...ops]
        newOps[index] = next
        setOps(newOps)
        setFeedback("idle")
    }

    const startEvaluation = () => {
        if (ops.includes("?")) {
            setFeedback("wrong")
            return
        }

        // Generate steps
        const steps = getEvaluationSteps(numbers, ops)
        setEvalSteps(steps)
        setIsEvaluating(true)
        setCurrentStepIndex(0)
        setFeedback("idle")

        // Auto-play steps
        let step = 0
        const interval = setInterval(() => {
            step++
            if (step >= steps.length) {
                clearInterval(interval)
                // Check final result
                const finalVal = steps[steps.length - 1].items[0] as number
                if (Math.abs(finalVal - target) < 1e-6) {
                    setFeedback("correct")
                    if (onSolve) onSolve(true)
                } else {
                    setFeedback("wrong")
                    if (onSolve) onSolve(false)
                    // Reset after a delay so user can try again
                    setTimeout(() => {
                        setIsEvaluating(false)
                        setEvalSteps([])
                        setCurrentStepIndex(0)
                    }, 2000)
                }
            } else {
                setCurrentStepIndex(step)
            }
        }, 1500) // 1.5s per step
    }

    // Render the computation tree
    const renderTree = () => {
        const step = evalSteps[currentStepIndex]
        if (!step || !step.treeNodes) return null

        const NODE_WIDTH = 60
        const NODE_HEIGHT = 60
        const X_SPACING = 80
        const Y_SPACING = 100
        const OFFSET_X = 50
        const OFFSET_Y = 50

        // Calculate canvas size
        const maxX = Math.max(...step.treeNodes.map(n => n.x))
        const maxY = Math.max(...step.treeNodes.map(n => n.y))
        const width = (maxX + 1) * X_SPACING + OFFSET_X * 2
        const height = (maxY + 1) * Y_SPACING + OFFSET_Y * 2

        return (
            <div className="flex flex-col items-center gap-8 w-full overflow-x-auto">
                <svg width={Math.max(600, width)} height={Math.max(400, height)} className="bg-white rounded-xl shadow-inner border border-gray-100">
                    <AnimatePresence>
                        {/* Edges */}
                        {step.treeNodes.map(node => {
                            if (!node.sources) return null
                            const sourceNodes = step.treeNodes!.filter(n => node.sources!.includes(n.id))
                            return sourceNodes.map(source => (
                                <motion.line
                                    key={`edge-${source.id}-${node.id}`}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    x1={source.x * X_SPACING + OFFSET_X + NODE_WIDTH / 2}
                                    y1={source.y * Y_SPACING + OFFSET_Y + NODE_HEIGHT}
                                    x2={node.x * X_SPACING + OFFSET_X + NODE_WIDTH / 2}
                                    y2={node.y * Y_SPACING + OFFSET_Y}
                                    stroke="#cbd5e1"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            ))
                        })}

                        {/* Nodes */}
                        {step.treeNodes.map((node) => {
                            const isOp = typeof node.val === "string"
                            const isResult = node.id.startsWith("res-")
                            const isNew = step.newEdge && step.newEdge.toId === node.id

                            return (
                                <motion.g
                                    key={node.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    {/* Node Background */}
                                    <rect
                                        x={node.x * X_SPACING + OFFSET_X}
                                        y={node.y * Y_SPACING + OFFSET_Y}
                                        width={NODE_WIDTH}
                                        height={NODE_HEIGHT}
                                        rx={12}
                                        fill={isOp ? "#fff" : isResult ? "#fef3c7" : "#eff6ff"}
                                        stroke={isOp ? "#bfdbfe" : isResult ? "#f59e0b" : "#3b82f6"}
                                        strokeWidth={isNew ? 4 : 2}
                                    />

                                    {/* Value */}
                                    <text
                                        x={node.x * X_SPACING + OFFSET_X + NODE_WIDTH / 2}
                                        y={node.y * Y_SPACING + OFFSET_Y + NODE_HEIGHT / 2 + 8}
                                        textAnchor="middle"
                                        fontSize={24}
                                        fontWeight="bold"
                                        fill={isOp ? "#3b82f6" : isResult ? "#b45309" : "#1e40af"}
                                    >
                                        {node.val}
                                    </text>

                                    {/* Label for Result Nodes (showing operation) */}
                                    {isResult && node.sources && (
                                        <text
                                            x={node.x * X_SPACING + OFFSET_X + NODE_WIDTH / 2}
                                            y={node.y * Y_SPACING + OFFSET_Y - 10}
                                            textAnchor="middle"
                                            fontSize={16}
                                            fontWeight="bold"
                                            fill="#f59e0b"
                                        >
                                            {node.op || (step.newEdge && step.newEdge.toId === node.id ? step.newEdge.op : "")}
                                        </text>
                                    )}
                                </motion.g>
                            )
                        })}
                    </AnimatePresence>
                </svg>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={step.explanation}
                    className="text-xl font-bold text-blue-800 bg-blue-50 px-6 py-3 rounded-full shadow-sm border border-blue-100"
                >
                    {step.explanation}
                </motion.div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 select-none">
            <div className="bg-white rounded-2xl shadow-xl border-4 border-blue-100 p-8 w-full relative overflow-hidden min-h-[500px]">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">填写运算符号</h2>
                        <p className="text-gray-500">点击圆圈选择符号，使等式成立</p>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-bold text-xl">
                        目标: {target}
                    </div>
                </div>

                {/* Main Display */}
                <div className="flex flex-col items-center justify-center mb-8 w-full">
                    {!isEvaluating ? (
                        // Input Mode
                        <div className="flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
                            {numbers.map((num, i) => (
                                <div key={i} className="flex items-center">
                                    <motion.div
                                        layoutId={`num-${i}`}
                                        className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg border-b-4 border-blue-700"
                                    >
                                        {num}
                                    </motion.div>
                                    {i < numbers.length - 1 && (
                                        <motion.div
                                            layoutId={`op-${i}`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => cycleOp(i)}
                                            className={`w-12 h-12 mx-2 rounded-full flex items-center justify-center cursor-pointer shadow-inner transition-colors duration-200 ${ops[i] === "?"
                                                ? "bg-yellow-100 border-2 border-dashed border-yellow-400 text-yellow-600"
                                                : "bg-white border-2 border-blue-200 text-blue-600 font-bold text-2xl shadow-sm"
                                                }`}
                                        >
                                            {ops[i]}
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                            <div className="flex items-center gap-4 ml-4">
                                <div className="text-4xl font-bold text-gray-400">=</div>
                                <div className={`w-20 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg border-b-4 transition-colors duration-300 ${feedback === "correct"
                                    ? "bg-gradient-to-br from-green-400 to-green-600 border-green-700 text-white"
                                    : "bg-gray-100 border-gray-300 text-gray-800"
                                    }`}>
                                    {target}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Evaluation Tree Mode
                        renderTree()
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 text-lg font-medium">
                        {feedback === "wrong" && !isEvaluating && (
                            <span className="text-red-500">
                                {ops.includes("?") ? "请先填完所有符号！" : "结果不对哦，再试试！"}
                            </span>
                        )}
                        {feedback === "correct" && (
                            <span className="text-green-600 text-2xl font-bold animate-bounce">太棒了！答案正确！🎉</span>
                        )}
                    </div>

                    {!isEvaluating && feedback !== "correct" && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    // Strategy Hint
                                    import("../lib/mathSolver").then(mod => {
                                        const hint = mod.getStrategyHint(numbers, target)
                                        alert("🧠 思维锦囊：\n" + hint)
                                    })
                                }}
                                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-bold text-lg shadow-lg transform transition hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
                            >
                                <span>🧠</span> 思路
                            </button>
                            <button
                                onClick={() => {
                                    // Filter for UI-compatible solutions (no parens needed)
                                    // We do this by checking if the solution string contains parens
                                    // If it does, it MIGHT still be valid if the parens are redundant, but usually solveExpression adds them only when needed.
                                    // A safer check: extract operators, run getEvaluationSteps, check result.

                                    const validSolutions = solutions.filter(sol => {
                                        // Extract operators from solution string
                                        // Assuming format "1 + 2 * 3 = 7"
                                        // We can match [+, -, *, ×, /, ÷]
                                        // Note: solveExpression uses × and ÷ ? Let's check mathSolver.ts. 
                                        // It uses + - and wrap adds parens.
                                        // Actually solveExpression uses + - but for * / it uses × ÷ in the string?
                                        // Looking at mathSolver.ts: 
                                        // expr: `${wrap(a, 2)} × ${wrap(b, 2)}`
                                        // So it uses × and ÷.

                                        // If solution has '(', it implies non-standard precedence, which this UI doesn't support.
                                        // So we can simply reject any solution with '('.
                                        return !sol.includes('(');
                                    });

                                    if (validSolutions.length > 0) {
                                        const sol = validSolutions[0];
                                        // Extract operators
                                        // Regex to find +, -, ×, ÷
                                        const solOps = sol.match(/[+\-×÷]/g);

                                        if (solOps && solOps.length === ops.length) {
                                            // Find first difference
                                            for (let i = 0; i < ops.length; i++) {
                                                if (ops[i] !== solOps[i]) {
                                                    const newOps = [...ops];
                                                    newOps[i] = solOps[i];
                                                    setOps(newOps);
                                                    // Show specific hint
                                                    // alert(`试试在第 ${i + 1} 个位置填入 "${solOps[i]}"`);
                                                    // Better: just fill it and show a toast/message
                                                    setFeedback("idle");
                                                    break;
                                                }
                                            }
                                        }
                                    } else {
                                        alert("这个题目可能需要括号才能解出来，或者没有解！(当前模式不支持括号)");
                                    }
                                }}
                                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-bold text-lg shadow-lg transform transition hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
                            >
                                <span>💡</span> 提示
                            </button>
                            <button
                                onClick={startEvaluation}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg transform transition hover:-translate-y-1 active:translate-y-0"
                            >
                                验证答案
                            </button>
                        </div>
                    )}

                    {feedback === "correct" && (
                        <button
                            onClick={() => {
                                setFeedback("idle")
                                setOps(Array(numbers.length - 1).fill("?"))
                            }}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg shadow-lg"
                        >
                            再玩一次
                        </button>
                    )}
                </div>

                {/* Solutions Panel */}
                <AnimatePresence>
                    {showSolutions && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200 max-h-96 overflow-y-auto"
                        >
                            <h3 className="text-green-800 font-bold mb-4 flex items-center gap-2 sticky top-0 bg-green-50 py-2">
                                <span>🔓</span> 所有可能的解法 ({solutions.length}种)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {solutions.length > 0 ? solutions.map((sol, idx) => (
                                    <div key={idx} className="bg-white px-4 py-2 rounded-lg border border-green-100 text-green-700 font-mono shadow-sm">
                                        {sol}
                                    </div>
                                )) : (
                                    <div className="text-gray-500 italic">没有找到简单的解法</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
