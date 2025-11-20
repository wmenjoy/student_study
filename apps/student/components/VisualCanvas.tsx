"use client"
import { useEffect, useRef } from 'react'

interface DrawInstruction {
  type: 'line' | 'rect' | 'circle' | 'text' | 'arrow'
  x?: number
  y?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  width?: number
  height?: number
  radius?: number
  text?: string
  label?: string
  color?: string
  size?: number
}

interface VisualCanvasProps {
  instructions: DrawInstruction[]
  width?: number
  height?: number
}

export function VisualCanvas({ instructions, width = 600, height = 400 }: VisualCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // 绘制所有指令
    instructions.forEach((inst) => {
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
            ctx.lineWidth = 2
            ctx.strokeRect(inst.x, inst.y, inst.width, inst.height)
            ctx.globalAlpha = 0.2
            ctx.fillRect(inst.x, inst.y, inst.width, inst.height)
            ctx.globalAlpha = 1

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
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(inst.x, inst.y, inst.radius, 0, Math.PI * 2)
            ctx.stroke()
            ctx.globalAlpha = 0.2
            ctx.fill()
            ctx.globalAlpha = 1

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
            ctx.lineWidth = 2
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
      }
    })
  }, [instructions, width, height])

  if (!instructions || instructions.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-inner">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-gray-200 rounded-lg mx-auto"
      />
    </div>
  )
}
