"use client"
import { useEffect, useState } from "react"

type Props = { start: number; end: number; step: number; stage: number }

export function SeriesBarSum({ start, end, step, stage }: Props) {
    const width = 680
    const height = 500
    const nums: number[] = []
    for (let x = start; x <= end; x += step) nums.push(x)
    const n = nums.length
    const pairSum = nums[0] + nums[n - 1]
    const sum = pairSum * n / 2

    const [animProgress, setAnimProgress] = useState(0)

    useEffect(() => {
        if (stage === 1) {
            setAnimProgress(0)
            let p = 0
            const interval = setInterval(() => {
                p += 0.05
                setAnimProgress(Math.min(1, p))
                if (p >= 1) clearInterval(interval)
            }, 30)
            return () => clearInterval(interval)
        } else if (stage >= 2) {
            setAnimProgress(1)
        }
    }, [stage])

    const maxVal = pairSum
    const barScale = 180 / maxVal
    const barWidth = Math.min(35, 500 / n)
    const startX = 40
    const startY = 100

    return (
        <svg width={width} height={height} className="svg-panel">
            <defs>
                <linearGradient id="barGradUp" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="barGradDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
            </defs>

            {/* Title */}
            <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">等差数列三角形求和</text>
            <text x={24} y={56} fontSize="14" fill="#6b7280">
                {start} + {start + step} + ... + {end} = ?
            </text>

            {/* Stage 0: Show ascending triangle */}
            {stage >= 0 && (
                <g transform={`translate(${startX}, ${startY})`}>
                    <text x={0} y={-10} fontSize="14" fontWeight="bold" fill="#374151">上升数列（蓝色）：</text>
                    {nums.map((num, i) => {
                        const x = i * (barWidth + 2)
                        const barHeight = num * barScale

                        return (
                            <g key={i}>
                                <rect
                                    x={x}
                                    y={200 - barHeight}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="url(#barGradUp)"
                                    stroke="#3b82f6"
                                    strokeWidth="1.5"
                                    rx={2}
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={215}
                                    textAnchor="middle"
                                    fill="#3b82f6"
                                    fontSize="10"
                                    fontWeight="bold"
                                >
                                    {num}
                                </text>
                            </g>
                        )
                    })}
                    <line x1={0} y1={200} x2={n * (barWidth + 2)} y2={200} stroke="#9ca3af" strokeWidth="1" />
                </g>
            )}

            {/* Stage 1: Show inverted triangle overlapping */}
            {stage >= 1 && (
                <g transform={`translate(${startX}, ${startY})`}>
                    <text x={0} y={240} fontSize="14" fontWeight="bold" fill="#374151">
                        倒扣数列（橙色）：
                    </text>
                    {nums.map((num, i) => {
                        const reverseNum = nums[n - 1 - i]
                        const x = i * (barWidth + 2)
                        const barHeight = reverseNum * barScale * animProgress

                        return (
                            <g key={i}>
                                {/* Inverted bar - grows downward from top */}
                                <rect
                                    x={x}
                                    y={200 - (pairSum * barScale)}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="url(#barGradDown)"
                                    stroke="#f97316"
                                    strokeWidth="1.5"
                                    rx={2}
                                    style={{ transition: "height 0.3s" }}
                                />
                                {animProgress > 0.5 && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={200 - (pairSum * barScale) + barHeight / 2 + 4}
                                        textAnchor="middle"
                                        fill="#fff"
                                        fontSize="9"
                                        fontWeight="bold"
                                    >
                                        {reverseNum}
                                    </text>
                                )}
                            </g>
                        )
                    })}
                </g>
            )}

            {/* Stage 2: Show rectangle formed */}
            {stage >= 2 && (
                <g transform={`translate(${startX}, ${startY + 250})`}>
                    <text x={0} y={-10} fontSize="14" fontWeight="bold" fill="#374151">
                        组成长方形：
                    </text>

                    {/* Rectangle visualization */}
                    <rect
                        x={0}
                        y={0}
                        width={n * (barWidth + 2) - 2}
                        height={pairSum * barScale}
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        rx={4}
                    />

                    {/* Width label */}
                    <g>
                        <path
                            d={`M0,${pairSum * barScale + 15} h${n * (barWidth + 2) - 2}`}
                            stroke="#16a34a"
                            strokeWidth="2"
                            markerEnd="url(#arrowGreen)"
                        />
                        <text
                            x={(n * (barWidth + 2)) / 2}
                            y={pairSum * barScale + 35}
                            textAnchor="middle"
                            fill="#16a34a"
                            fontSize="14"
                            fontWeight="bold"
                        >
                            宽 = {n} 个数
                        </text>
                    </g>

                    {/* Height label */}
                    <g>
                        <path
                            d={`M${n * (barWidth + 2) + 10},0 v${pairSum * barScale}`}
                            stroke="#16a34a"
                            strokeWidth="2"
                        />
                        <text
                            x={n * (barWidth + 2) + 20}
                            y={pairSum * barScale / 2}
                            fill="#16a34a"
                            fontSize="14"
                            fontWeight="bold"
                        >
                            高 = {pairSum}
                        </text>
                        <text
                            x={n * (barWidth + 2) + 20}
                            y={pairSum * barScale / 2 + 18}
                            fill="#6b7280"
                            fontSize="11"
                        >
                            (首+尾)
                        </text>
                    </g>
                </g>
            )}

            {/* Stage 3: Show final calculation */}
            {stage >= 3 && (
                <g transform="translate(40, 440)" style={{ opacity: 1, transition: "opacity 0.5s 0.3s" }}>
                    <rect x={0} y={0} width={600} height={50} rx={8} fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                    <text x={10} y={20} fontSize="14" fontWeight="bold" fill="#374151">计算结果：</text>
                    <text x={10} y={38} fontSize="16" fontWeight="bold" fill="#16a34a">
                        总和 = 长方形面积 ÷ 2 = ({nums[0]} + {nums[n - 1]}) × {n} ÷ 2 = {sum}
                    </text>
                </g>
            )}

            <defs>
                <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L0,8 L8,4 z" fill="#16a34a" />
                </marker>
            </defs>
        </svg>
    )
}
