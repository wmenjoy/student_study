"use client"
import { useEffect, useState, useRef } from "react"

type Props = { 
  n: number; 
  stage: number
  showFormula: boolean
  showCanvas: boolean
  animationSpeed: number
}

export function SequenceCubeSumVisualization({ n, stage, showFormula, showCanvas, animationSpeed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [highlightedCube, setHighlightedCube] = useState<number | null>(null)

  // Calculate cube sum: 1³ + 2³ + ... + n³
  const calculateCubeSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i * i
    }
    return sum
  }

  // Calculate corresponding square sum
  const calculateSquareSum = (num: number) => {
    let sum = 0
    for (let i = 1; i <= num; i++) {
      sum += i * i
    }
    return sum
  }

  const cubeSum = calculateCubeSum(n)
  const squareSum = calculateSquareSum(n)
  const squareOfSquareSum = squareSum * squareSum

  // Canvas animation for cube sum visualization
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
      { title: "展示立方数列", draw: drawCubeSequence },
      { title: "3D堆叠展示", draw: draw3DStacking },
      { title: "与平方和对比", draw: drawSquareComparison },
      { title: "发现奇妙关系", draw: drawRelationship },
      { title: "公式验证", draw: drawFormulaVerification }
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

    function drawCubeSequence(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 20px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('立方数列：1³ + 2³ + 3³ + ... + n³', width / 2, 30)
      
      // Draw cubes of increasing size
      const maxSize = 50
      const spacing = 15
      let currentX = 50
      let y = 60
      
      for (let i = 1; i <= Math.min(n, 6); i++) {
        const cubeSize = (i / n) * maxSize
        const color = `hsl(${220 + i * 15}, 70%, 50%)`
        
        // Draw isometric cube
        drawIsometricCube(ctx, currentX, y, cubeSize, color)
        
        // Draw label
        ctx.fillStyle = '#1f2937'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${i}³`, currentX + cubeSize/2, y + cubeSize + 20)
        
        currentX += cubeSize + spacing
        
        if (currentX > width - 150) {
          currentX = 50
          y += maxSize + 50
        }
      }
    }

    function draw3DStacking(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('3D堆叠效果', width / 2, 30)
      
      // Draw 3D stacking pyramid
      const baseSize = 60
      const centerX = width / 2
      const startY = 60
      
      for (let layer = 1; layer <= Math.min(n, 5); layer++) {
        const layerSize = baseSize * (1 - layer * 0.15)
        const y = startY + (layer - 1) * (baseSize * 0.3)
        
        // Draw layer with perspective
        ctx.fillStyle = `hsla(${220 + layer * 20}, 70%, ${50 + layer * 5}%, 0.8)`
        drawIsometricCube(ctx, centerX - layerSize/2, y, layerSize, `hsl(${220 + layer * 20}, 70%, 50%)`)
        
        // Draw layer label
        ctx.fillStyle = '#1f2937'
        ctx.font = '14px Arial'
        ctx.fillText(`第${layer}层`, centerX, y - 10)
      }
    }

    function drawSquareComparison(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('立方和 vs 平方和', width / 2, 30)
      
      const leftX = 100
      const rightX = width / 2 + 50
      const y = 60
      
      // Draw cube sum
      ctx.fillStyle = '#3b82f620'
      ctx.fillRect(leftX, y, 200, 80)
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.strokeRect(leftX, y, 200, 80)
      
      ctx.fillStyle = '#1f2937'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`立方和`, leftX + 100, y + 40)
      ctx.fillText(`${cubeSum}`, leftX + 100, y + 65)
      
      // Draw square sum
      ctx.fillStyle = '#10b98120'
      ctx.fillRect(rightX, y, 200, 80)
      ctx.strokeStyle = '#10b981'
      ctx.strokeRect(rightX, y, 200, 80)
      
      ctx.fillText(`平方和`, rightX + 100, y + 40)
      ctx.fillText(`${squareSum}`, rightX + 100, y + 65)
      
      // Draw arrow and relationship
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(leftX + 200, y + 40)
      ctx.lineTo(rightX, y + 40)
      ctx.stroke()
      
      ctx.fillStyle = '#6b7280'
      ctx.font = '14px Arial'
      ctx.fillText('? 关系？', (leftX + rightX + 200) / 2, y + 25)
    }

    function drawRelationship(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('发现奇妙关系！', width / 2, 30)
      
      const centerX = width / 2
      const y = 60
      
      // Draw equation showing relationship
      ctx.font = '20px Arial'
      ctx.fillText(`1³+2³+...+${n}³`, centerX, y)
      ctx.fillText(`= (1²+2²+...+${n}²)²`, centerX, y + 40)
      
      ctx.font = '24px Arial'
      ctx.fillStyle = '#dc2626'
      ctx.fillText(`= ${squareSum}² = ${squareOfSquareSum}`, centerX, y + 80)
      
      // Draw verification arrows
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.setLineDash([])
      
      // Left arrow
      ctx.beginPath()
      ctx.moveTo(centerX - 150, y + 20)
      ctx.lineTo(centerX - 50, y + 20)
      ctx.lineTo(centerX - 50, y + 40)
      ctx.stroke()
      
      // Right arrow
      ctx.beginPath()
      ctx.moveTo(centerX + 150, y + 60)
      ctx.lineTo(centerX + 50, y + 60)
      ctx.lineTo(centerX + 50, y + 80)
      ctx.stroke()
    }

    function drawFormulaVerification(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText('公式验证', width / 2, 30)
      
      const centerX = width / 2
      const y = 60
      const lineHeight = 30
      
      // Step 1: Calculate sum
      ctx.font = '16px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'left'
      ctx.fillText(`立方和：1³+2³+...+${n}³ = ${cubeSum}`, 100, y)
      
      // Step 2: Calculate square sum
      ctx.fillText(`平方和：1²+2²+...+${n}² = ${squareSum}`, 100, y + lineHeight)
      
      // Step 3: Square the square sum
      ctx.fillText(`平方和的平方：(${squareSum})² = ${squareOfSquareSum}`, 100, y + lineHeight * 2)
      
      // Step 4: Show equality
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`✓ 立方和 = 平方和的平方`, centerX, y + lineHeight * 3 + 20)
      
      // Draw formula
      ctx.fillStyle = '#dc2626'
      ctx.font = 'bold 18px Arial'
      ctx.fillText(`[${n}×${n+1}/2]² = ${Math.pow(n*(n+1)/2, 2)}`, centerX, y + lineHeight * 4 + 20)
    }

    // Helper function to draw isometric cube
    function drawIsometricCube(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
      // Top face
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + size * 0.866, y - size * 0.5)
      ctx.lineTo(x, y - size)
      ctx.lineTo(x - size * 0.866, y - size * 0.5)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Right face
      ctx.fillStyle = color + 'cc'
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size * 0.866, y - size * 0.5)
      ctx.lineTo(x + size * 0.866, y - size * 0.5 + size)
      ctx.lineTo(x, y + size)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      
      // Left face
      ctx.fillStyle = color + '99'
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x - size * 0.866, y - size * 0.5 + size)
      ctx.lineTo(x - size * 0.866, y - size * 0.5)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }

    // Start animation
    animate()
  }, [showCanvas, n, stage, animationSpeed])

  // Handle cube hover
  const handleCubeHover = (index: number) => {
    setHighlightedCube(index)
  }

  const handleCubeLeave = () => {
    setHighlightedCube(null)
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
              "展示立方数列",
              "3D堆叠展示", 
              "与平方和对比",
              "发现奇妙关系",
              "公式验证"
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
          立方和数列求和：1³ + 2³ + ... + {n}³
        </h3>
        <div className="text-lg text-gray-600">
          = {cubeSum}
        </div>
      </div>

      {/* Formula Display */}
      {showFormula && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-3">立方和公式推导：</h4>
          <div className="space-y-2 text-lg font-mono">
            <div className="bg-white p-2 rounded">立方和 = 1³ + 2³ + ... + n³</div>
            <div className="bg-white p-2 rounded">平方和 = 1² + 2² + ... + n² = S</div>
            <div className="bg-white p-2 rounded">立方和 = S²</div>
            <div className="bg-white p-2 rounded">S = n(n+1)/2</div>
            <div className="bg-green-100 p-2 rounded border-2 border-green-300">
              <strong>立方和 = [n(n+1)/2]²</strong>
            </div>
          </div>
        </div>
      )}

      {/* 3D Cube Visualization */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-800 mb-3">3D立方体可视化：</h4>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: Math.min(n, 10) }).map((_, i) => {
            const size = i + 1
            const value = size * size * size
            const isHighlighted = highlightedCube === i
            
            return (
              <div 
                key={i}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  isHighlighted ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
                onMouseEnter={() => handleCubeHover(i)}
                onMouseLeave={handleCubeLeave}
              >
                <div className="text-center">
                  <div className="font-bold text-blue-600 mb-1">{size}³</div>
                  <div className="relative mx-auto mb-2">
                    {/* Simple 3D cube representation */}
                    <div className="w-8 h-8 relative" style={{ transformStyle: 'preserve-3d' }}>
                      {/* Top face */}
                      <div className="absolute inset-0 bg-blue-500 transform rotate-x-60" 
                           style={{ 
                             width: '32px', 
                             height: '32px',
                             transform: 'rotateX(60deg) translateZ(16px)',
                             transformStyle: 'preserve-3d'
                           }} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">= {value}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comparison with Square Sum */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-bold text-green-800 mb-3">奇妙发现：</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded">
            <h5 className="font-semibold text-blue-600 mb-2">立方和</h5>
            <div className="text-2xl font-bold text-blue-700">
              1³ + 2³ + ... + {n}³
            </div>
            <div className="text-lg font-mono text-blue-600">
              = {cubeSum}
            </div>
          </div>
          
          <div className="bg-white p-3 rounded">
            <h5 className="font-semibold text-green-600 mb-2">平方和的平方</h5>
            <div className="text-2xl font-bold text-green-700">
              (1² + 2² + ... + {n}²)²
            </div>
            <div className="text-lg font-mono text-green-600">
              = ({squareSum})²
            </div>
            <div className="text-lg font-mono text-green-600">
              = {squareOfSquareSum}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-xl font-bold text-purple-600">
            ✨ 立方和 = 平方和的平方！
          </div>
          <div className="text-lg font-mono text-purple-600 mt-2">
            {cubeSum} = {squareOfSquareSum}
          </div>
        </div>
      </div>

      {/* Pattern Discovery */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-bold text-yellow-800 mb-3">规律总结：</h4>
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <h5 className="font-semibold text-gray-700 mb-2">对应平方和：</h5>
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
        </div>
      </div>

      {/* Interactive Tips */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-bold text-purple-800 mb-2">小朋友，记住这些神奇规律：</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>立方和公式：[n(n+1)/2]²</li>
          <li>立方和等于平方和的平方，这是数学中最美妙的规律之一！</li>
          <li>这个规律叫做"尼科马霍斯定理"的特殊情况</li>
          <li>1³+2³+...+n³ = (1+2+...+n)²</li>
          <li>通过3D图形可以帮助理解这个奇妙的数学关系</li>
        </ul>
      </div>
    </div>
  )
}