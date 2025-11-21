"use client"
import { useEffect, useState } from "react"

type Props = { 
  operation: "add" | "subtract" | "multiply" | "divide"
  num1: number
  num2: number
  stage: number
  useFraction: boolean
  useDecimal: boolean
}

export function ArithmeticVisualization({ operation, num1, num2, stage, useFraction, useDecimal }: Props) {
  const cellSize = 20
  const padding = 40
  const svgWidth = 800
  const svgHeight = 400

  const [visibleBlocks1, setVisibleBlocks1] = useState(0)
  const [visibleBlocks2, setVisibleBlocks2] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [animatedResult, setAnimatedResult] = useState(0)

  // Get display values
  const getDisplayValue = (num: number, isFraction: boolean = false, isDecimal: boolean = false) => {
    if (isFraction) {
      const numerator = Math.floor(num / 5)
      const denominator = 5 + Math.floor(num % 5)
      return { numerator, denominator, value: numerator / denominator }
    }
    if (isDecimal) {
      return { value: num / 10, display: (num / 10).toFixed(1), numerator: 0, denominator: 1 }
    }
    return { value: num, display: num.toString(), numerator: 0, denominator: 1 }
  }

  const display1 = getDisplayValue(num1, useFraction, useDecimal)
  const display2 = getDisplayValue(num2, useFraction, useDecimal)

  // Calculate result
  const calculateResult = () => {
    let result: number
    if (useFraction) {
      const n1 = Math.floor(num1 / 5) / (5 + Math.floor(num1 % 5))
      const n2 = Math.floor(num2 / 3) / (3 + Math.floor(num2 % 3))
      switch (operation) {
        case "add": result = n1 + n2; break
        case "subtract": result = n1 - n2; break
        case "multiply": result = n1 * n2; break
        case "divide": result = n2 !== 0 ? n1 / n2 : 0; break
        default: result = 0
      }
    } else if (useDecimal) {
      const n1 = num1 / 10
      const n2 = num2 / 10
      switch (operation) {
        case "add": result = n1 + n2; break
        case "subtract": result = n1 - n2; break
        case "multiply": result = n1 * n2; break
        case "divide": result = n2 !== 0 ? n1 / n2 : 0; break
        default: result = 0
      }
    } else {
      switch (operation) {
        case "add": result = num1 + num2; break
        case "subtract": result = num1 - num2; break
        case "multiply": result = num1 * num2; break
        case "divide": result = num2 !== 0 ? num1 / num2 : 0; break
        default: result = 0
      }
    }
    return result
  }

  const result = calculateResult()

  useEffect(() => {
    if (stage === 0) {
      setVisibleBlocks1(0)
      setVisibleBlocks2(0)
      setShowResult(false)
      setAnimatedResult(0)
    } else if (stage === 1) {
      // Show first number
      setVisibleBlocks1(0)
      setVisibleBlocks2(0)
      setShowResult(false)
      setAnimatedResult(0)
      
      let count = 0
      const targetCount = useFraction || useDecimal ? 10 : Math.min(num1, 50)
      const interval = setInterval(() => {
        count += 1
        setVisibleBlocks1(count)
        if (count >= targetCount) {
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    } else if (stage === 2) {
      // Show second number and operation
      setVisibleBlocks1(useFraction || useDecimal ? 10 : Math.min(num1, 50))
      let count = 0
      const targetCount = useFraction || useDecimal ? 10 : Math.min(num2, 50)
      const interval = setInterval(() => {
        count += 1
        setVisibleBlocks2(count)
        if (count >= targetCount) {
          clearInterval(interval)
          // Animate result
          setTimeout(() => {
            setShowResult(true)
            let animCount = 0
            const resultInterval = setInterval(() => {
              animCount += 1
              setAnimatedResult(animCount)
              if (animCount >= Math.min(Math.abs(result), 100)) {
                clearInterval(resultInterval)
              }
            }, 30)
            return () => clearInterval(resultInterval)
          }, 500)
        }
      }, 50)
      return () => clearInterval(interval)
    } else if (stage >= 3) {
      setVisibleBlocks1(useFraction || useDecimal ? 10 : Math.min(num1, 50))
      setVisibleBlocks2(useFraction || useDecimal ? 10 : Math.min(num2, 50))
      setShowResult(true)
      setAnimatedResult(Math.min(Math.abs(result), 100))
    }
  }, [stage, num1, num2, useFraction, useDecimal, result])

  const drawBlocks = (count: number, visible: number, color: string, offsetX: number, offsetY: number) => {
    const blocks = []
    const cols = Math.min(10, Math.ceil(Math.sqrt(count)))
    const rows = Math.ceil(count / cols)

    for (let i = 0; i < count && i < visible; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = offsetX + col * (cellSize + 2)
      const y = offsetY + row * (cellSize + 2)

      blocks.push(
        <rect
          key={`block-${i}`}
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          fill={color}
          stroke="#fff"
          strokeWidth="2"
          style={{
            opacity: 1,
            transform: "scale(1)",
            transition: "all 0.3s ease"
          }}
        />
      )
    }

    return (
      <g>
        {blocks}
        <text x={offsetX + cols * (cellSize + 2) / 2} y={offsetY - 10} textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>
          {useFraction ? `分数 (${display1.numerator}/${display1.denominator})` : useDecimal ? display1.display : `数量 ${count}`}
        </text>
      </g>
    )
  }

  const drawFractionPie = (numerator: number, denominator: number, color: string, centerX: number, centerY: number, radius: number) => {
    const anglePerSlice = 360 / denominator
    const slices = []

    for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerSlice
      const endAngle = (i + 1) * anglePerSlice
      const isFilled = i < numerator

      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

      const largeArcFlag = anglePerSlice > 180 ? 1 : 0

      slices.push(
        <path
          key={`slice-${i}`}
          d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
          fill={isFilled ? color : "#e5e7eb"}
          stroke="#fff"
          strokeWidth="2"
          style={{
            opacity: 1,
            transition: "all 0.3s ease"
          }}
        />
      )
    }

    return (
      <g>
        {slices}
        <text x={centerX} y={centerY + radius + 20} textAnchor="middle" fontSize="12" fill={color}>
          {numerator}/{denominator}
        </text>
      </g>
    )
  }

  const drawDecimalBar = (value: number, color: string, x: number, y: number, width: number, height: number) => {
    const filledWidth = width * Math.min(value, 1)
    
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
        <rect 
          x={x} 
          y={y} 
          width={filledWidth} 
          height={height} 
          fill={color}
          style={{
            transition: "all 0.5s ease"
          }}
        />
        <text x={x + width / 2} y={y - 10} textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>
          {value.toFixed(1)}
        </text>
      </g>
    )
  }

  return (
    <svg width={svgWidth} height={svgHeight} className="svg-panel">
      {/* Title */}
      <text x={svgWidth / 2} y={25} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">
        {operation === "add" ? "加法" : operation === "subtract" ? "减法" : operation === "multiply" ? "乘法" : "除法"}几何演示
      </text>

      {/* Main visualization */}
      {useFraction ? (
        // Fraction visualization with pie charts
        <g transform={`translate(${padding}, ${padding + 40})`}>
          {drawFractionPie(display1.numerator, display1.denominator, "#3b82f6", 100, 100, 60)}
          
          {/* Operation symbol */}
          {stage >= 2 && (
            <text x={200} y={110} textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
              {operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"}
            </text>
          )}
          
          {stage >= 2 && drawFractionPie(
            Math.floor(num2 / 3), 
            3 + Math.floor(num2 % 3), 
            "#10b981", 
            300, 
            100, 
            60
          )}
          
          {/* Equals sign and result */}
          {showResult && (
            <>
              <text x={400} y={110} textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
                =
              </text>
              <text x={500} y={110} textAnchor="middle" fontSize="18" fill="#dc2626">
                {result.toFixed(2)}
              </text>
            </>
          )}
        </g>
      ) : useDecimal ? (
        // Decimal visualization with bars
        <g transform={`translate(${padding}, ${padding + 40})`}>
          {drawDecimalBar(display1.value, "#3b82f6", 50, 50, 200, 40)}
          
          {/* Operation symbol */}
          {stage >= 2 && (
            <text x={320} y={75} textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
              {operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"}
            </text>
          )}
          
          {stage >= 2 && drawDecimalBar(display2.value, "#10b981", 370, 50, 200, 40)}
          
          {/* Equals sign and result */}
          {showResult && (
            <>
              <text x={640} y={75} textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
                =
              </text>
              <text x={700} y={75} textAnchor="middle" fontSize="18" fill="#dc2626">
                {result.toFixed(2)}
              </text>
            </>
          )}
        </g>
      ) : (
        // Integer visualization with blocks
        <g transform={`translate(${padding}, ${padding + 40})`}>
          {drawBlocks(num1, visibleBlocks1, "#3b82f6", 50, 50)}
          
          {/* Operation symbol */}
          {stage >= 2 && (
            <text x={320} y={100} textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
              {operation === "add" ? "+" : operation === "subtract" ? "-" : operation === "multiply" ? "×" : "÷"}
            </text>
          )}
          
          {stage >= 2 && drawBlocks(num2, visibleBlocks2, "#10b981", 370, 50)}
          
          {/* Result visualization */}
          {showResult && (
            <>
              <text x={640} y={100} textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
                =
              </text>
              
              {/* Result blocks */}
              <g transform="translate(680, 50)">
                {Array.from({ length: Math.min(Math.abs(result), 100) }).map((_, i) => {
                  if (i >= animatedResult) return null
                  const row = Math.floor(i / 10)
                  const col = i % 10
                  const x = col * (cellSize + 2)
                  const y = row * (cellSize + 2)

                  return (
                    <rect
                      key={`result-${i}`}
                      x={x}
                      y={y}
                      width={cellSize}
                      height={cellSize}
                      fill={result >= 0 ? "#dc2626" : "#f59e0b"}
                      stroke="#fff"
                      strokeWidth="2"
                      style={{
                        opacity: 1,
                        transition: "all 0.3s ease"
                      }}
                    />
                  )
                })}
                <text x={50} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">
                  结果: {result}
                </text>
              </g>
            </>
          )}
        </g>
      )}

      {/* Operation explanation */}
      {stage >= 2 && (
        <g transform={`translate(${svgWidth / 2}, ${svgHeight - 60})`}>
          <rect x={-200} y={-20} width={400} height={40} fill="#f3f4f6" stroke="#9ca3af" strokeWidth="1" rx="5" />
          <text x={0} y={5} textAnchor="middle" fontSize="14" fill="#1f2937">
            {operation === "add" && "加法：将两组物体合并在一起"}
            {operation === "subtract" && "减法：从第一组中移除第二组的物体"}
            {operation === "multiply" && "乘法：重复加法，第一组重复第二组次数"}
            {operation === "divide" && "除法：将第一组平均分成第二组份"}
          </text>
        </g>
      )}
    </svg>
  )
}