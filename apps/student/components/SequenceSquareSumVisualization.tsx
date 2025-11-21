"use client"
import { useEffect, useState, useRef } from "react"

type Props = { 
  n: number; 
  stage: number
  showFormula: boolean
  showCanvas: boolean
  animationSpeed: number
}

export function SequenceSquareSumVisualization({ n, stage, showFormula, showCanvas, animationSpeed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [highlightedSquare, setHighlightedSquare] = useState<number | null>(null)

  // Calculate square sum: 1² + 2² + ... + n²
  const calculateSquareSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i
    }
    return sum
  }

  // Calculate cube sum: 1³ + 2³ + ... + n³
  const calculateCubeSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i * i
    }
    return sum
  }

  const squareSum = calculateSquareSum(n)
  const cubeSum = calculateCubeSum(n)

  // Canvas animation for square sum visualization
  useEffect(() => {
    if (!showCanvas || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up for animation
    let currentStep = 0
    const animationSteps = [
      { title: "展示平方数列", draw: drawSquareSequence },
      { title: "配对求和思想", draw: drawPairingMethod },
      { title: "高斯方法应用", draw: drawGaussMethod },
      { title: "公式推导", draw: drawFormulaDerivation },
      { title: "验证结果", draw: drawVerification }
    ]

    const animate = () => {
      if (currentStep < animationSteps.length) {
        const step = animationSteps[currentStep]
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        step.draw(ctx, canvas.width, canvas.height)
        currentStep++
        setAnimationStep(currentStep)
        setTimeout(animate, animationSpeed)
      }
    }

    function drawSquareSequence(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 20px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('平方数列：1² + 2² + 3² + ... + n²', width / 2, 30)
      
      // Draw squares of increasing size
      const maxSize = 60
      const spacing = 10
      let currentX = 50
      let y = 60
      
      const startY = 60
      
      for (let i = 1; i <= Math.min(n, 8); i++) {
        const squareSize = (i / n) * maxSize
        const color = `hsl(${200 + i * 20}, 70%, 50%)`
        
        // Draw square
        ctx.fillStyle = color + '40'
        ctx.fillRect(currentX, y, squareSize, squareSize)
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.strokeRect(currentX, y, squareSize, squareSize)
        
        // Draw label
        ctx.fillStyle = '#1f2937'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${i}²`, currentX + squareSize/2, y + squareSize/2 + 4)
        
        currentX += squareSize + spacing
        
        if (currentX > width - 100) {
          currentX = 50
          y += maxSize + spacing + 20
        }
      }
    }

    function drawPairingMethod(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('配对求和：首尾配对', width / 2, 30)
      
      // Draw pairing visualization
      const centerX = width / 2
      const startY = 60
      const boxHeight = 40
      const boxWidth = 120
      
      // Draw pairs
      for (let i = 1; i <= Math.min(n, 6); i++) {
        const j = n - i + 1
        if (i > j) break
        
        const y = startY + (i - 1) * (boxHeight + 10)
        
        // Draw pair box
        ctx.fillStyle = '#3b82f620'
        ctx.fillRect(centerX - boxWidth/2, y, boxWidth, boxHeight)
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.strokeRect(centerX - boxWidth/2, y, boxWidth, boxHeight)
        
        // Draw pair content
        ctx.fillStyle = '#1f2937'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${i}² + ${j}² = ${i*i + j*j}`, centerX, y + boxHeight/2 + 5)
        
        // Draw arrow to next
        if (i < Math.min(n, 6) / 2) {
          ctx.beginPath()
          ctx.moveTo(centerX, y + boxHeight)
          ctx.lineTo(centerX, y + boxHeight + 10)
          ctx.strokeStyle = '#6b7280'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    function drawGaussMethod(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('高斯方法：寻找规律', width / 2, 30)
      
      // Draw triangular arrangement
      const dotSize = 8
      const spacing = 15
      const startX = 100
      const startY = 60
      
      for (let row = 1; row <= Math.min(n, 6); row++) {
        for (let col = 1; col <= row; col++) {
          const x = startX + (row - col) * spacing/2 + col * spacing
          const y = startY + (row - 1) * spacing
          
          // Draw dot
          ctx.fillStyle = `hsl(${row * 40}, 70%, 50%)`
          ctx.beginPath()
          ctx.arc(x, y, dotSize/2, 0, 2 * Math.PI)
          ctx.fill()
          
          // Draw value
          if (row === col) {
            ctx.fillStyle = '#1f2937'
            ctx.font = '10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(`${row*row}`, x, y - dotSize)
          }
        }
      }
      
      // Draw formula
      ctx.font = '16px Arial'
      ctx.fillStyle = '#dc2626'
      ctx.textAlign = 'center'
      ctx.fillText(`每行和：1²+2²+...+${Math.min(n, 6)}² = ${calculateSquareSum(Math.min(n, 6))}`, width / 2, startY + Math.min(n, 6) * spacing + 30)
    }

    function drawFormulaDerivation(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('公式推导过程', width / 2, 30)
      
      const y = 60
      const lineHeight = 25
      
      // Step 1
      ctx.font = '16px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'left'
      ctx.fillText(`S = 1² + 2² + 3² + ... + n²`, 50, y)
      
      // Step 2
      ctx.fillText(`S = n² + (n-1)² + (n-2)² + ... + 1²`, 50, y + lineHeight)
      
      // Step 3
      ctx.fillText(`2S = (n²+1²) + ((n-1)²+2²) + ... + (1²+n²)`, 50, y + lineHeight * 2)
      
      // Step 4
      ctx.fillText(`2S = (n²+1²) + ((n-1)²+2²) + ... + (1²+n²)`, 50, y + lineHeight * 3)
      ctx.fillText(`   = (n+1) + (n+1) + ... + (n+1)`, 50, y + lineHeight * 4)
      ctx.fillText(`   = n(n+1)`, 50, y + lineHeight * 5)
      
      // Final result
      ctx.fillStyle = '#dc2626'
      ctx.font = 'bold 18px Arial'
      ctx.fillText(`S = n(n+1)/2 × (2n+1)/3 = n(n+1)(2n+1)/6`, 50, y + lineHeight * 6)
    }

    function drawVerification(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('验证结果', width / 2, 30)
      
      // Draw comparison
      const y = 60
      const lineHeight = 30
      
      // Direct calculation
      ctx.font = '16px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'left'
      ctx.fillText(`直接计算：1²+2²+...+${n}² = ${squareSum}`, 50, y)
      
      // Formula calculation
      ctx.fillText(`公式计算：n(n+1)(2n+1)/6`, 50, y + lineHeight)
      ctx.fillText(`           = ${n}×${n+1}×${2*n+1}/6`, 50, y + lineHeight * 2)
      ctx.fillText(`           = ${(n*(n+1)*(2*n+1))/6}`, 50, y + lineHeight * 3)
      
      // Result
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`✓ 结果一致：${squareSum}`, width / 2, y + lineHeight * 4 + 20)
    }

    // Start animation
    animate()
  }, [showCanvas, n, stage, animationSpeed])

  // Handle square hover
  const handleSquareHover = (index: number) => {
    setHighlightedSquare(index)
  }

  const handleSquareLeave = () => {
    setHighlightedSquare(null)
  }

  if (showCanvas) {
    return (
      <div className="w-full">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="border-2 border-gray-200 rounded-lg w-full"
        />
        <div className="mt-4 text-center">
          <div className="text-lg font-bold text-blue-600 mb-2">
            动画步骤 {animationStep}/5: {[
              "展示平方数列",
              "配对求和思想", 
              "高斯方法应用",
              "公式推导",
              "验证结果"
            ][Math.max(0, animationStep - 1)]}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          平方和数列求和：1² + 2² + ... + {n}²
        </h3>
        <div className="text-lg text-gray-600">
          = {squareSum}
        </div>
      </div>

      {/* Formula Display */}
      {showFormula && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-3">平方和公式推导：</h4>
          <div className="space-y-2 text-lg font-mono">
            <div className="bg-white p-2 rounded">S = 1² + 2² + 3² + ... + n²</div>
            <div className="bg-white p-2 rounded">S = n² + (n-1)² + (n-2)² + ... + 1² (倒序)</div>
            <div className="bg-white p-2 rounded">2S = (n²+1²) + ((n-1)²+2²) + ... + (1²+n²)</div>
            <div className="bg-white p-2 rounded">2S = (n+1) + (n+1) + ... + (n+1) = n(n+1)</div>
            <div className="bg-white p-2 rounded">S = n(n+1)/2 × (2n+1)/3 = n(n+1)(2n+1)/6</div>
          </div>
        </div>
      )}

      {/* Square Visualization */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-800 mb-3">正方形可视化：</h4>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: Math.min(n, 8) }).map((_, i) => {
            const size = i + 1
            const value = size * size
            const isHighlighted = highlightedSquare === i
            
            return (
              <div 
                key={i}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  isHighlighted ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
                onMouseEnter={() => handleSquareHover(i)}
                onMouseLeave={handleSquareLeave}
              >
                <div className="text-center">
                  <div className="font-bold text-blue-600 mb-1">{size}²</div>
                  <div 
                    className="mx-auto border-2 border-blue-400"
                    style={{
                      width: `${Math.min(size * 8, 60)}px`,
                      height: `${Math.min(size * 8, 60)}px`
                    }}
                  >
                    <div className="grid grid-cols-3 gap-0.5 p-1">
                      {Array.from({ length: value }).map((_, j) => (
                        <div 
                          key={j}
                          className="bg-blue-400" 
                          style={{
                            width: '2px',
                            height: '2px'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">= {value}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cube Sum Extension */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-bold text-green-800 mb-3">立方和数列（拓展）：</h4>
        <div className="text-lg text-green-700 mb-2">
          1³ + 2³ + ... + {n}³ = {cubeSum}
        </div>
        <div className="text-lg font-mono bg-white p-2 rounded">
          [n(n+1)/2]² = [{n}×{n+1}/2]² = {Math.pow(n*(n+1)/2, 2)}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          有趣的规律：立方和等于平方和的平方！
        </div>
      </div>

      {/* Pattern Discovery */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-bold text-yellow-800 mb-3">发现的规律：</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-gray-700 mb-2">平方和增长：</h5>
            <div className="space-y-1 text-sm">
              {Array.from({ length: Math.min(n, 5) }).map((_, i) => {
                const k = i + 1
                const sum = calculateSquareSum(k)
                return (
                  <div key={i} className="flex justify-between bg-white p-2 rounded">
                    <span>1²到{k}²:</span>
                    <span className="font-bold">{sum}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-gray-700 mb-2">立方和增长：</h5>
            <div className="space-y-1 text-sm">
              {Array.from({ length: Math.min(n, 5) }).map((_, i) => {
                const k = i + 1
                const sum = calculateCubeSum(k)
                return (
                  <div key={i} className="flex justify-between bg-white p-2 rounded">
                    <span>1³到{k}³:</span>
                    <span className="font-bold">{sum}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tips */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-bold text-purple-800 mb-2">小朋友，记住这些技巧：</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>平方和公式：n(n+1)(2n+1)/6</li>
          <li>立方和公式：[n(n+1)/2]²</li>
          <li>立方和等于平方和的平方，这是很神奇的规律！</li>
          <li>高斯配对法是求和的重要思想</li>
          <li>通过图形可以帮助理解抽象的公式</li>
        </ul>
      </div>
    </div>
  )
}