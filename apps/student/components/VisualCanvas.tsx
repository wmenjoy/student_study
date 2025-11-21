"use client"
import { useEffect, useRef, useState } from 'react'

interface DrawInstruction {
  type: 'line' | 'rect' | 'circle' | 'text' | 'arrow' | 'bracket' | 'dashed-line' | 'curve' | 'clear' |
        'polygon' | 'arc' | 'ellipse' | 'double-arrow' | 'fraction' |
        'cuboid' | 'cylinder' | 'cone'  // 立体图形
  
  // 通用属性
  x?: number
  y?: number
  color?: string
  size?: number
  step?: number
  lineWidth?: number
  
  // 填充属性
  fill?: boolean
  fillColor?: string
  
  // 线段/箭头
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  
  // 矩形
  width?: number
  height?: number
  
  // 圆形
  radius?: number
  
  // 椭圆
  radiusX?: number
  radiusY?: number
  
  // 圆弧/扇形
  startAngle?: number  // 起始角度（度数）
  endAngle?: number    // 结束角度（度数）
  
  // 多边形
  points?: {x: number, y: number}[]
  closed?: boolean  // 是否闭合
  
  // 分数
  numerator?: string    // 分子
  denominator?: string  // 分母
  
  // 立体图形
  length?: number       // 长方体的长
  depth?: number        // 长方体的宽（深度）
  showDimensions?: boolean  // 是否显示尺寸标注
  view?: 'isometric' | 'front' | 'top'  // 视角
  
  // 文字
  text?: string
  label?: string
  
  // 虚线
  dash?: number[]
  
  // 清除
  clearPrevious?: boolean
}

interface VisualCanvasProps {
  instructions: DrawInstruction[]
  width?: number
  height?: number
  currentStep?: number  // 新增：当前显示到第几步（用于动画）
  autoPlay?: boolean    // 新增：是否自动播放
  playSpeed?: number    // 新增：播放速度（毫秒）
}

export function VisualCanvas({
  instructions,
  width = 600,
  height = 400,
  currentStep,
  autoPlay = false,
  playSpeed = 1000
}: VisualCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationStep, setAnimationStep] = useState(0)

  // 自动播放动画
  useEffect(() => {
    if (!autoPlay || !instructions || instructions.length === 0) return

    const maxStep = Math.max(...instructions.map(inst => inst.step || 0))
    if (animationStep >= maxStep) {
      setAnimationStep(0)
      return
    }

    const timer = setTimeout(() => {
      setAnimationStep(prev => prev + 1)
    }, playSpeed)

    return () => clearTimeout(timer)
  }, [autoPlay, animationStep, instructions, playSpeed])

  // 确定当前应该显示到哪一步
  const displayStep = currentStep !== undefined ? currentStep : (autoPlay ? animationStep : Infinity)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !instructions || instructions.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 设置默认样式
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 只绘制当前步骤及之前的指令
    let visibleInstructions = instructions.filter(inst =>
      (inst.step === undefined || inst.step <= displayStep)
    )

    // 处理 clear 指令：如果某个 step 有 clearPrevious，则只显示该 step 及之后的内容
    const clearInstructions = visibleInstructions.filter(inst => inst.type === 'clear' && inst.clearPrevious)
    if (clearInstructions.length > 0) {
      const lastClearStep = Math.max(...clearInstructions.map(inst => inst.step || 0))
      visibleInstructions = visibleInstructions.filter(inst => (inst.step || 0) >= lastClearStep)
    }

    visibleInstructions.forEach((inst) => {
      const color = inst.color || '#3b82f6'
      ctx.strokeStyle = color
      ctx.fillStyle = color

      switch (inst.type) {
        case 'line':
          if (inst.x1 !== undefined && inst.y1 !== undefined &&
            inst.x2 !== undefined && inst.y2 !== undefined) {
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(inst.x1, inst.y1)
            ctx.lineTo(inst.x2, inst.y2)
            ctx.stroke()
          }
          break

        case 'rect':
          if (inst.x !== undefined && inst.y !== undefined &&
            inst.width !== undefined && inst.height !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            
            // 填充
            if (inst.fill) {
              ctx.fillStyle = inst.fillColor || color
              ctx.globalAlpha = inst.fillColor ? 1 : 0.2
              ctx.fillRect(inst.x, inst.y, inst.width, inst.height)
              ctx.globalAlpha = 1
            }
            
            // 边框
            ctx.strokeStyle = color
            ctx.strokeRect(inst.x, inst.y, inst.width, inst.height)

            // 如果有label，绘制在矩形中心
            if (inst.label) {
              ctx.fillStyle = '#1e40af'
              ctx.font = 'bold 14px Arial'
              ctx.fillText(inst.label, inst.x + inst.width / 2, inst.y + inst.height / 2)
            }
          }
          break

        case 'circle':
          if (inst.x !== undefined && inst.y !== undefined && inst.radius !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.beginPath()
            ctx.arc(inst.x, inst.y, inst.radius, 0, Math.PI * 2)
            
            // 填充
            if (inst.fill) {
              ctx.fillStyle = inst.fillColor || color
              ctx.globalAlpha = inst.fillColor ? 1 : 0.2
              ctx.fill()
              ctx.globalAlpha = 1
            }
            
            // 边框
            ctx.strokeStyle = color
            ctx.stroke()

            // 如果有label，绘制在圆心
            if (inst.label) {
              ctx.fillStyle = '#1e40af'
              ctx.font = 'bold 14px Arial'
              ctx.fillText(inst.label, inst.x, inst.y)
            }
          }
          break

        case 'text':
          if (inst.x !== undefined && inst.y !== undefined && inst.text) {
            ctx.fillStyle = color
            ctx.font = `${inst.size || 14}px Arial`
            ctx.fillText(inst.text, inst.x, inst.y)
          }
          break

        case 'arrow':
          if (inst.x1 !== undefined && inst.y1 !== undefined &&
            inst.x2 !== undefined && inst.y2 !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.strokeStyle = color
            ctx.fillStyle = color

            // 绘制线段
            ctx.beginPath()
            ctx.moveTo(inst.x1, inst.y1)
            ctx.lineTo(inst.x2, inst.y2)
            ctx.stroke()

            // 绘制箭头
            const angle = Math.atan2(inst.y2 - inst.y1, inst.x2 - inst.x1)
            const arrowSize = 10
            ctx.beginPath()
            ctx.moveTo(inst.x2, inst.y2)
            ctx.lineTo(
              inst.x2 - arrowSize * Math.cos(angle - Math.PI / 6),
              inst.y2 - arrowSize * Math.sin(angle - Math.PI / 6)
            )
            ctx.lineTo(
              inst.x2 - arrowSize * Math.cos(angle + Math.PI / 6),
              inst.y2 - arrowSize * Math.sin(angle + Math.PI / 6)
            )
            ctx.closePath()
            ctx.fill()
          }
          break

        case 'bracket':
          // 大括号，用于标注范围
          if (inst.x1 !== undefined && inst.y1 !== undefined &&
            inst.x2 !== undefined && inst.y2 !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.strokeStyle = color
            
            const isVertical = Math.abs(inst.x2 - inst.x1) < Math.abs(inst.y2 - inst.y1)
            const size = 8
            
            ctx.beginPath()
            if (isVertical) {
              // 垂直大括号
              const midY = (inst.y1 + inst.y2) / 2
              ctx.moveTo(inst.x1, inst.y1)
              ctx.lineTo(inst.x1 - size, inst.y1)
              ctx.lineTo(inst.x1 - size, midY - size)
              ctx.lineTo(inst.x1 - size * 1.5, midY)
              ctx.lineTo(inst.x1 - size, midY + size)
              ctx.lineTo(inst.x1 - size, inst.y2)
              ctx.lineTo(inst.x1, inst.y2)
            } else {
              // 水平大括号
              const midX = (inst.x1 + inst.x2) / 2
              ctx.moveTo(inst.x1, inst.y1)
              ctx.lineTo(inst.x1, inst.y1 + size)
              ctx.lineTo(midX - size, inst.y1 + size)
              ctx.lineTo(midX, inst.y1 + size * 1.5)
              ctx.lineTo(midX + size, inst.y1 + size)
              ctx.lineTo(inst.x2, inst.y1 + size)
              ctx.lineTo(inst.x2, inst.y1)
            }
            ctx.stroke()
          }
          break

        case 'dashed-line':
          // 虚线
          if (inst.x1 !== undefined && inst.y1 !== undefined &&
            inst.x2 !== undefined && inst.y2 !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.strokeStyle = color
            ctx.setLineDash(inst.dash || [5, 5])
            
            ctx.beginPath()
            ctx.moveTo(inst.x1, inst.y1)
            ctx.lineTo(inst.x2, inst.y2)
            ctx.stroke()
            
            ctx.setLineDash([])  // 重置虚线
          }
          break

        case 'curve':
          // 曲线（二次贝塞尔曲线）
          if (inst.x1 !== undefined && inst.y1 !== undefined &&
            inst.x2 !== undefined && inst.y2 !== undefined &&
            inst.x !== undefined && inst.y !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.strokeStyle = color
            
            ctx.beginPath()
            ctx.moveTo(inst.x1, inst.y1)
            ctx.quadraticCurveTo(inst.x, inst.y, inst.x2, inst.y2)
            ctx.stroke()
          }
          break

        case 'clear':
          // 清除指定区域（用白色填充）
          if (inst.x !== undefined && inst.y !== undefined &&
            inst.width !== undefined && inst.height !== undefined) {
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(inst.x, inst.y, inst.width, inst.height)
          }
          // 如果设置了 clearPrevious，会在上面的过滤逻辑中处理
          break

        case 'polygon':
          // 多边形
          if (inst.points && inst.points.length >= 2) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.beginPath()
            ctx.moveTo(inst.points[0].x, inst.points[0].y)
            for (let i = 1; i < inst.points.length; i++) {
              ctx.lineTo(inst.points[i].x, inst.points[i].y)
            }
            if (inst.closed !== false) {
              ctx.closePath()
            }
            
            // 填充
            if (inst.fill) {
              ctx.fillStyle = inst.fillColor || color
              ctx.globalAlpha = inst.fillColor ? 1 : 0.2
              ctx.fill()
              ctx.globalAlpha = 1
            }
            
            // 边框
            ctx.strokeStyle = color
            ctx.stroke()
          }
          break

        case 'ellipse':
          // 椭圆
          if (inst.x !== undefined && inst.y !== undefined &&
            inst.radiusX !== undefined && inst.radiusY !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.beginPath()
            ctx.ellipse(inst.x, inst.y, inst.radiusX, inst.radiusY, 0, 0, Math.PI * 2)
            
            // 填充
            if (inst.fill) {
              ctx.fillStyle = inst.fillColor || color
              ctx.globalAlpha = inst.fillColor ? 1 : 0.2
              ctx.fill()
              ctx.globalAlpha = 1
            }
            
            // 边框
            ctx.strokeStyle = color
            ctx.stroke()
          }
          break

        case 'arc':
          // 圆弧/扇形
          if (inst.x !== undefined && inst.y !== undefined &&
            inst.radius !== undefined &&
            inst.startAngle !== undefined && inst.endAngle !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            
            // 将角度转换为弧度
            const startRad = (inst.startAngle * Math.PI) / 180
            const endRad = (inst.endAngle * Math.PI) / 180
            
            ctx.beginPath()
            if (inst.fill) {
              // 扇形：从圆心开始
              ctx.moveTo(inst.x, inst.y)
            }
            ctx.arc(inst.x, inst.y, inst.radius, startRad, endRad)
            if (inst.fill) {
              ctx.closePath()
            }
            
            // 填充
            if (inst.fill) {
              ctx.fillStyle = inst.fillColor || color
              ctx.globalAlpha = inst.fillColor ? 1 : 0.3
              ctx.fill()
              ctx.globalAlpha = 1
            }
            
            // 边框
            ctx.strokeStyle = color
            ctx.stroke()
          }
          break

        case 'double-arrow':
          // 双向箭头
          if (inst.x1 !== undefined && inst.y1 !== undefined &&
            inst.x2 !== undefined && inst.y2 !== undefined) {
            ctx.lineWidth = inst.lineWidth || 2
            ctx.strokeStyle = color
            ctx.fillStyle = color

            // 绘制线段
            ctx.beginPath()
            ctx.moveTo(inst.x1, inst.y1)
            ctx.lineTo(inst.x2, inst.y2)
            ctx.stroke()

            // 绘制两端的箭头
            const angle = Math.atan2(inst.y2 - inst.y1, inst.x2 - inst.x1)
            const arrowSize = 10
            
            // 终点箭头
            ctx.beginPath()
            ctx.moveTo(inst.x2, inst.y2)
            ctx.lineTo(
              inst.x2 - arrowSize * Math.cos(angle - Math.PI / 6),
              inst.y2 - arrowSize * Math.sin(angle - Math.PI / 6)
            )
            ctx.lineTo(
              inst.x2 - arrowSize * Math.cos(angle + Math.PI / 6),
              inst.y2 - arrowSize * Math.sin(angle + Math.PI / 6)
            )
            ctx.closePath()
            ctx.fill()
            
            // 起点箭头（反向）
            ctx.beginPath()
            ctx.moveTo(inst.x1, inst.y1)
            ctx.lineTo(
              inst.x1 + arrowSize * Math.cos(angle - Math.PI / 6),
              inst.y1 + arrowSize * Math.sin(angle - Math.PI / 6)
            )
            ctx.lineTo(
              inst.x1 + arrowSize * Math.cos(angle + Math.PI / 6),
              inst.y1 + arrowSize * Math.sin(angle + Math.PI / 6)
            )
            ctx.closePath()
            ctx.fill()
          }
          break

        case 'fraction':
          // 分数
          if (inst.x !== undefined && inst.y !== undefined &&
            inst.numerator !== undefined && inst.denominator !== undefined) {
            const fontSize = inst.size || 16
            ctx.fillStyle = color
            ctx.font = `${fontSize}px Arial`
            ctx.textAlign = 'center'
            
            // 绘制分子
            ctx.fillText(inst.numerator, inst.x, inst.y - fontSize * 0.3)
            
            // 绘制分数线
            const lineWidth = Math.max(ctx.measureText(inst.numerator).width, 
                                      ctx.measureText(inst.denominator).width) + 4
            ctx.lineWidth = 1.5
            ctx.strokeStyle = color
            ctx.beginPath()
            ctx.moveTo(inst.x - lineWidth / 2, inst.y)
            ctx.lineTo(inst.x + lineWidth / 2, inst.y)
            ctx.stroke()
            
            // 绘制分母
            ctx.fillText(inst.denominator, inst.x, inst.y + fontSize * 0.7)
          }
          break
      }
    })
  }, [instructions, width, height, displayStep])

  if (!instructions || instructions.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg p-3 shadow-inner">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg mx-auto"
      />
    </div>
  )
}
