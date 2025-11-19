"use client"
import { useEffect, useState } from "react"

type Props = { numbers: number[]; target: number; stage?: number }

export function FillOperators({ numbers, target, stage = 0 }: Props) {
    const width = 680
    const height = 550

    const [showHints, setShowHints] = useState(false)

    useEffect(() => {
        if (stage >= 1) {
            setShowHints(true)
        } else {
            setShowHints(false)
        }
    }, [stage])

    // Generate some example solutions based on the problem
    const getSolutions = () => {
        const nums = numbers
        const tgt = target

        // Example solutions for common cases
        if (nums.length === 4 && nums[0] === 1 && nums[1] === 2 && nums[2] === 3 && nums[3] === 4) {
            if (tgt === 0) {
                return [
                    "(1+4) - (2+3) = 0",
                    "(4-3) - (2-1) = 0"
                ]
            } else if (tgt === 10) {
                return [
                    "1 + 2 + 3 + 4 = 10"
                ]
            }
        }

        if (nums.length === 4 && nums.every(n => n === 3) && tgt === 6) {
            return [
                "(3-3) × 3 + 3 = 6",
                "(3+3+3) ÷ 3 = 3... 不对",
                "3 × (3-3) + 3 = 3... 不对",
                "3 + 3 + 3 - 3 = 6 ✓"
            ]
        }

        if (nums.length === 4 && nums.every(n => n === 5) && tgt === 5) {
            return [
                "5 + 5 - 5 = 5",
                "5 × 5 ÷ 5 = 5",
                "(5 - 5) × 5 + 5 = 5"
            ]
        }

        return ["尝试不同的运算符组合"]
    }

    const solutions = getSolutions()

    return (
        <svg width={width} height={height} className="svg-panel">
            <defs>
                <linearGradient id="numBoxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>

            {/* Title */}
            <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">填写运算符号</text>
            <text x={24} y={56} fontSize="14" fill="#6b7280">
                使用 +、-、×、÷ 或 ( ) 使等式成立
            </text>

            {/* Problem Display */}
            <g transform="translate(40, 100)">
                <text x={0} y={-10} fontSize="14" fontWeight="bold" fill="#374151">题目：</text>

                {/* Number boxes */}
                {numbers.map((num, i) => (
                    <g key={i} transform={`translate(${i * 70}, 0)`}>
                        <rect
                            x={0}
                            y={0}
                            width={60}
                            height={60}
                            rx={8}
                            fill="url(#numBoxGrad)"
                            stroke="#3b82f6"
                            strokeWidth="2"
                        />
                        <text
                            x={30}
                            y={40}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="24"
                            fontWeight="bold"
                        >
                            {num}
                        </text>

                        {/* Operator placeholder */}
                        {i < numbers.length - 1 && (
                            <g transform="translate(65, 0)">
                                <circle cx={0} cy={30} r={15} fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                                <text x={0} y={35} textAnchor="middle" fill="#92400e" fontSize="18" fontWeight="bold">?</text>
                            </g>
                        )}
                    </g>
                ))}

                {/* Equals sign */}
                <g transform={`translate(${numbers.length * 70 + 10}, 0)`}>
                    <text x={0} y={40} fontSize="32" fontWeight="bold" fill="#374151">=</text>
                </g>

                {/* Target box */}
                <g transform={`translate(${numbers.length * 70 + 50}, 0)`}>
                    <rect
                        x={0}
                        y={0}
                        width={80}
                        height={60}
                        rx={8}
                        fill="url(#targetGrad)"
                        stroke="#10b981"
                        strokeWidth="3"
                    />
                    <text
                        x={40}
                        y={40}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="28"
                        fontWeight="bold"
                    >
                        {target}
                    </text>
                </g>
            </g>

            {/* Strategy hints */}
            {stage >= 1 && showHints && (
                <g transform="translate(40, 220)">
                    <rect
                        x={0}
                        y={0}
                        width={600}
                        height={140}
                        rx={8}
                        fill="#fef3c7"
                        stroke="#f59e0b"
                        strokeWidth="2"
                    />
                    <text x={15} y={25} fontSize="15" fontWeight="bold" fill="#92400e">
                        💡 解题思路：
                    </text>

                    <text x={15} y={50} fontSize="13" fill="#92400e">
                        1. 从结果倒推：结果是 {target}，思考哪些运算能得到这个数
                    </text>
                    <text x={15} y={72} fontSize="13" fill="#92400e">
                        2. 分组策略：可以把数字分成两组，分别计算后再组合
                    </text>
                    <text x={15} y={94} fontSize="13" fill="#92400e">
                        3. 试错法：尝试不同的运算符组合，验证结果
                    </text>
                    <text x={15} y={116} fontSize="13" fill="#92400e">
                        4. 特殊技巧：相同数字相减得0，相除得1，可以巧妙利用
                    </text>
                </g>
            )}

            {/* Example solutions */}
            {stage >= 2 && (
                <g transform="translate(40, 380)">
                    <rect
                        x={0}
                        y={0}
                        width={600}
                        height={Math.min(150, 30 + solutions.length * 25)}
                        rx={8}
                        fill="#dcfce7"
                        stroke="#22c55e"
                        strokeWidth="2"
                    />
                    <text x={15} y={25} fontSize="15" fontWeight="bold" fill="#166534">
                        ✓ 参考答案：
                    </text>

                    {solutions.slice(0, 4).map((sol, i) => (
                        <text key={i} x={15} y={50 + i * 25} fontSize="14" fill="#166534" fontFamily="monospace">
                            {sol}
                        </text>
                    ))}
                </g>
            )}
        </svg>
    )
}
