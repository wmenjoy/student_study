"use client"
import { useEffect, useState, useRef } from "react"

type Props = { 
  a: number; 
  b: number; 
  c: number; 
  stage: number
  showExpansion: boolean
  showCanvas: boolean
}

export function SquareThreeSumVisualization({ a, b, c, stage, showExpansion, showCanvas }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [highlightedTerm, setHighlightedTerm] = useState<string | null>(null)

  const cellSize = 20
  const padding = 40

  // Calculate all terms
  const terms = {
    a2: a * a,
    b2: b * b,
    c2: c * c,
    ab2: 2 * a * b,
    ac2: 2 * a * c,
    bc2: 2 * b * c
  }

  const total = terms.a2 + terms.b2 + terms.c2 + terms.ab2 + terms.ac2 + terms.bc2

  // Canvas animation for expansion process
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
      { title: "开始：(a+b+c)²", draw: drawInitial },
      { title: "第一步：(a+b+c)(a+b+c)", draw: drawFirstStep },
      { title: "第二步：a(a+b+c) + b(a+b+c) + c(a+b+c)", draw: drawSecondStep },
      { title: "第三步：展开每一项", draw: drawThirdStep },
      { title: "完成：a²+b²+c²+2ab+2ac+2bc", draw: drawFinalStep }
    ]

    const animate = () => {
      if (currentStep < animationSteps.length) {
        const step = animationSteps[currentStep]
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        step.draw(ctx, canvas.width, canvas.height)
        currentStep++
        setAnimationStep(currentStep)
        setTimeout(animate, 1500)
      }
    }

    function drawInitial(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 24px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText(`(${a}+${b}+${c})²`, width / 2, 50)
      
      // Draw initial square
      const squareSize = 150
      const x = (width - squareSize) / 2
      const y = 80
      
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, squareSize, squareSize)
      
      // Fill with gradient
      const gradient = ctx.createLinearGradient(x, y, x + squareSize, y + squareSize)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)')
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)')
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, squareSize, squareSize)
    }

    function drawFirstStep(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 20px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText(`(${a}+${b}+${c}) × (${a}+${b}+${c})`, width / 2, 30)
      
      // Draw two rectangles side by side
      const rectWidth = 120
      const rectHeight = 100
      const spacing = 20
      const totalWidth = rectWidth * 2 + spacing
      const startX = (width - totalWidth) / 2
      const y = 60
      
      // First rectangle
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'
      ctx.fillRect(startX, y, rectWidth, rectHeight)
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.strokeRect(startX, y, rectWidth, rectHeight)
      ctx.fillStyle = '#1f2937'
      ctx.font = '16px Arial'
      ctx.fillText(`(${a}+${b}+${c})`, startX + rectWidth/2, y + rectHeight/2 + 5)
      
      // Second rectangle
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)'
      ctx.fillRect(startX + rectWidth + spacing, y, rectWidth, rectHeight)
      ctx.strokeStyle = '#10b981'
      ctx.strokeRect(startX + rectWidth + spacing, y, rectWidth, rectHeight)
      ctx.fillStyle = '#1f2937'
      ctx.fillText(`(${a}+${b}+${c})`, startX + rectWidth + spacing + rectWidth/2, y + rectHeight/2 + 5)
    }

    function drawSecondStep(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 18px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText(`${a}(${a}+${b}+${c}) + ${b}(${a}+${b}+${c}) + ${c}(${a}+${b}+${c})`, width / 2, 30)
      
      // Draw three rectangles
      const rectWidth = 100
      const rectHeight = 80
      const spacing = 15
      const totalWidth = rectWidth * 3 + spacing * 2
      const startX = (width - totalWidth) / 2
      const y = 60
      
      const colors = ['#3b82f6', '#10b981', '#f59e0b']
      const labels = [`${a}×(${a}+${b}+${c})`, `${b}×(${a}+${b}+${c})`, `${c}×(${a}+${b}+${c})`]
      
      for (let i = 0; i < 3; i++) {
        const x = startX + i * (rectWidth + spacing)
        
        ctx.fillStyle = colors[i] + '20'
        ctx.fillRect(x, y, rectWidth, rectHeight)
        ctx.strokeStyle = colors[i]
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, rectWidth, rectHeight)
        
        ctx.fillStyle = '#1f2937'
        ctx.font = '14px Arial'
        ctx.fillText(labels[i], x + rectWidth/2, y + rectHeight/2 + 5)
      }
    }

    function drawThirdStep(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 16px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText(`${a}²+${a}${b}+${a}${c} + ${b}${a}+${b}²+${b}${c} + ${c}${a}+${c}${b}+${c}²`, width / 2, 30)
      
      // Draw six small rectangles
      const rectWidth = 80
      const rectHeight = 60
      const spacing = 10
      const cols = 3
      const rows = 2
      const totalWidth = cols * rectWidth + (cols - 1) * spacing
      const totalHeight = rows * rectHeight + (rows - 1) * spacing
      const startX = (width - totalWidth) / 2
      const y = 60
      
      const terms = [
        { label: `${a}²`, color: '#3b82f6' },
        { label: `${a}${b}`, color: '#8b5cf6' },
        { label: `${a}${c}`, color: '#ec4899' },
        { label: `${b}${a}`, color: '#8b5cf6' },
        { label: `${b}²`, color: '#10b981' },
        { label: `${b}${c}`, color: '#f59e0b' }
      ]
      
      let termIndex = 0
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (termIndex >= terms.length) break
          
          const x = startX + col * (rectWidth + spacing)
          const termY = y + row * (rectHeight + spacing)
          const term = terms[termIndex]
          
          ctx.fillStyle = term.color + '20'
          ctx.fillRect(x, termY, rectWidth, rectHeight)
          ctx.strokeStyle = term.color
          ctx.lineWidth = 2
          ctx.strokeRect(x, termY, rectWidth, rectHeight)
          
          ctx.fillStyle = '#1f2937'
          ctx.font = '14px Arial'
          ctx.fillText(term.label, x + rectWidth/2, termY + rectHeight/2 + 5)
          
          termIndex++
        }
      }
    }

    function drawFinalStep(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.font = 'bold 20px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.textAlign = 'center'
      ctx.fillText(`${a}² + ${b}² + ${c}² + 2${a}${b} + 2${a}${c} + 2${b}${c}`, width / 2, 30)
      
      // Draw six rectangles with final terms
      const sizes = [
        { w: terms.a2 * 5, h: 30, color: '#3b82f6', label: `${a}²` },
        { w: terms.b2 * 5, h: 30, color: '#10b981', label: `${b}²` },
        { w: terms.c2 * 5, h: 30, color: '#f59e0b', label: `${c}²` },
        { w: terms.ab2 * 5, h: 30, color: '#8b5cf6', label: `2${a}${b}` },
        { w: terms.ac2 * 5, h: 30, color: '#ec4899', label: `2${a}${c}` },
        { w: terms.bc2 * 5, h: 30, color: '#f97316', label: `2${b}${c}` }
      ]
      
      let currentX = 50
      const y = 80
      
      sizes.forEach((size, index) => {
        // Draw rectangle
        ctx.fillStyle = size.color + '30'
        ctx.fillRect(currentX, y, size.w, size.h)
        ctx.strokeStyle = size.color
        ctx.lineWidth = 2
        ctx.strokeRect(currentX, y, size.w, size.h)
        
        // Draw label
        ctx.fillStyle = '#1f2937'
        ctx.font = 'bold 14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(size.label, currentX + size.w/2, y + size.h/2 + 5)
        
        currentX += size.w + 15
      })
      
      // Draw total
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(currentX, y, 150, 40)
      ctx.strokeStyle = '#dc2626'
      ctx.strokeRect(currentX, y, 150, 40)
      ctx.fillStyle = 'white'
      ctx.font = 'bold 16px Arial'
      ctx.fillText(`= ${total}`, currentX + 75, y + 25)
    }

    // Start animation
    animate()
  }, [showCanvas, a, b, c, stage])

  // Highlight terms on hover
  const handleTermHover = (term: string) => {
    setHighlightedTerm(term)
  }

  const handleTermLeave = () => {
    setHighlightedTerm(null)
  }

  if (showCanvas) {
    return (
      <div className="w-full">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="border-2 border-gray-200 rounded-lg w-full"
        />
        <div className="mt-4 text-center">
          <div className="text-lg font-bold text-blue-600 mb-2">
            动画步骤 {animationStep}/5: {[
              "开始：(a+b+c)²",
              "第一步：(a+b+c)(a+b+c)", 
              "第二步：a(a+b+c) + b(a+b+c) + c(a+b+c)",
              "第三步：展开每一项",
              "完成：a²+b²+c²+2ab+2ac+2bc"
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
          完全平方和公式可视化：({a}+{b}+{c})²
        </h3>
        <div className="text-lg text-gray-600">
          = {a}² + {b}² + {c}² + 2{a}{b} + 2{a}{c} + 2{b}{c} = {total}
        </div>
      </div>

      {/* Expansion Process */}
      {showExpansion && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-3">展开过程：</h4>
          <div className="space-y-2 text-lg">
            <div className="flex items-center space-x-2">
              <span className="font-mono bg-white px-2 py-1 rounded">({a}+{b}+{c})²</span>
              <span>=</span>
              <span className="font-mono bg-white px-2 py-1 rounded">({a}+{b}+{c})({a}+{b}+{c})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono bg-white px-2 py-1 rounded">=</span>
              <span className="font-mono bg-white px-2 py-1 rounded">{a}({a}+{b}+{c})</span>
              <span>+</span>
              <span className="font-mono bg-white px-2 py-1 rounded">{b}({a}+{b}+{c})</span>
              <span>+</span>
              <span className="font-mono bg-white px-2 py-1 rounded">{c}({a}+{b}+{c})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono bg-white px-2 py-1 rounded">=</span>
              <span className="font-mono bg-white px-2 py-1 rounded">{a}²+{a}{b}+{a}{c}</span>
              <span>+</span>
              <span className="font-mono bg-white px-2 py-1 rounded">{b}{a}+{b}²+{b}{c}</span>
              <span>+</span>
              <span className="font-mono bg-white px-2 py-1 rounded">{c}{a}+{c}{b}+{c}²</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono bg-white px-2 py-1 rounded">=</span>
              <span className="font-mono bg-white px-2 py-1 rounded">{a}² + {b}² + {c}²</span>
              <span>+</span>
              <span className="font-mono bg-white px-2 py-1 rounded">2{a}{b} + 2{a}{c} + 2{b}{c}</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Representation with Blocks */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Square terms */}
        <div 
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            highlightedTerm === 'a2' ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-white'
          }`}
          onMouseEnter={() => handleTermHover('a2')}
          onMouseLeave={handleTermLeave}
        >
          <div className="text-center">
            <div className="font-bold text-blue-600 mb-2">{a}²</div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: terms.a2 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-blue-500 border border-white"></div>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">= {terms.a2}</div>
          </div>
        </div>

        <div 
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            highlightedTerm === 'b2' ? 'border-green-500 bg-green-100' : 'border-gray-200 bg-white'
          }`}
          onMouseEnter={() => handleTermHover('b2')}
          onMouseLeave={handleTermLeave}
        >
          <div className="text-center">
            <div className="font-bold text-green-600 mb-2">{b}²</div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: terms.b2 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-green-500 border border-white"></div>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">= {terms.b2}</div>
          </div>
        </div>

        <div 
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            highlightedTerm === 'c2' ? 'border-yellow-500 bg-yellow-100' : 'border-gray-200 bg-white'
          }`}
          onMouseEnter={() => handleTermHover('c2')}
          onMouseLeave={handleTermLeave}
        >
          <div className="text-center">
            <div className="font-bold text-yellow-600 mb-2">{c}²</div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: terms.c2 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-yellow-500 border border-white"></div>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">= {terms.c2}</div>
          </div>
        </div>

        {/* Cross terms */}
        <div 
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            highlightedTerm === 'ab2' ? 'border-purple-500 bg-purple-100' : 'border-gray-200 bg-white'
          }`}
          onMouseEnter={() => handleTermHover('ab2')}
          onMouseLeave={handleTermLeave}
        >
          <div className="text-center">
            <div className="font-bold text-purple-600 mb-2">2{a}{b}</div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: terms.ab2 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-purple-500 border border-white"></div>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">= {terms.ab2}</div>
          </div>
        </div>

        <div 
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            highlightedTerm === 'ac2' ? 'border-pink-500 bg-pink-100' : 'border-gray-200 bg-white'
          }`}
          onMouseEnter={() => handleTermHover('ac2')}
          onMouseLeave={handleTermLeave}
        >
          <div className="text-center">
            <div className="font-bold text-pink-600 mb-2">2{a}{c}</div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: terms.ac2 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-pink-500 border border-white"></div>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">= {terms.ac2}</div>
          </div>
        </div>

        <div 
          className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
            highlightedTerm === 'bc2' ? 'border-orange-500 bg-orange-100' : 'border-gray-200 bg-white'
          }`}
          onMouseEnter={() => handleTermHover('bc2')}
          onMouseLeave={handleTermLeave}
        >
          <div className="text-center">
            <div className="font-bold text-orange-600 mb-2">2{b}{c}</div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: terms.bc2 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-orange-500 border border-white"></div>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-2">= {terms.bc2}</div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center">
          <div className="font-bold text-red-600 mb-2">总和</div>
          <div className="text-2xl font-bold text-red-700">
            {terms.a2} + {terms.b2} + {terms.c2} + {terms.ab2} + {terms.ac2} + {terms.bc2} = {total}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-2">小朋友，记住这个规律：</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>三个数的平方等于每个数的平方相加</li>
          <li>再加上每两个数乘积的2倍</li>
          <li>总共有6项：3个平方项 + 3个交叉项</li>
          <li>用彩色方块可以帮助你记住每一项！</li>
        </ul>
      </div>
    </div>
  )
}