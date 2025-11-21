"use client"
import { useEffect, useState } from "react"

type Props = { 
  shape: "triangle" | "rectangle" | "circle" | "polygon"
  size: number
  stage: number
  showGrid: boolean
  showCoordinates: boolean
}

export function GeometricShapesVisualization({ shape, size, stage, showGrid, showCoordinates }: Props) {
  const svgWidth = 600
  const svgHeight = 400
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2

  const [animationProgress, setAnimationProgress] = useState(0)
  const [showDimensions, setShowDimensions] = useState(false)
  const [highlightArea, setHighlightArea] = useState(false)

  // Generate shape path and properties
  const getShapeData = () => {
    switch (shape) {
      case "triangle": {
        const base = size * 30
        const height = size * 25
        const points = [
          { x: centerX, y: centerY - height / 2 },
          { x: centerX - base / 2, y: centerY + height / 2 },
          { x: centerX + base / 2, y: centerY + height / 2 }
        ]
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        return { points, path, area: (base * height) / 2, perimeter: base + 2 * Math.sqrt((base/2) ** 2 + height ** 2) }
      }
      case "rectangle": {
        const width = size * 40
        const height = size * 25
        const points = [
          { x: centerX - width / 2, y: centerY - height / 2 },
          { x: centerX + width / 2, y: centerY - height / 2 },
          { x: centerX + width / 2, y: centerY + height / 2 },
          { x: centerX - width / 2, y: centerY + height / 2 }
        ]
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        return { points, path, area: width * height, perimeter: 2 * (width + height) }
      }
      case "circle": {
        const radius = size * 20
        const path = `M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + radius - 0.01} ${centerY}`
        return { points: [], path, area: Math.PI * radius * radius, perimeter: 2 * Math.PI * radius, radius }
      }
      case "polygon": {
        const sides = 6 // Hexagon
        const radius = size * 25
        const points = []
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
          points.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          })
        }
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        const sideLength = 2 * radius * Math.sin(Math.PI / sides)
        const apothem = radius * Math.cos(Math.PI / sides)
        return { points, path, area: (sides * sideLength * apothem) / 2, perimeter: sides * sideLength }
      }
      default:
        return { points: [], path: '', area: 0, perimeter: 0 }
    }
  }

  const shapeData = getShapeData()

  useEffect(() => {
    if (stage === 0) {
      setAnimationProgress(0)
      setShowDimensions(false)
      setHighlightArea(false)
    } else if (stage === 1) {
      // Animate shape drawing
      setAnimationProgress(0)
      setShowDimensions(false)
      setHighlightArea(false)
      
      let progress = 0
      const interval = setInterval(() => {
        progress += 0.02
        setAnimationProgress(progress)
        if (progress >= 1) {
          clearInterval(interval)
        }
      }, 20)
      return () => clearInterval(interval)
    } else if (stage === 2) {
      setAnimationProgress(1)
      setShowDimensions(true)
      setHighlightArea(false)
    } else if (stage >= 3) {
      setAnimationProgress(1)
      setShowDimensions(true)
      setHighlightArea(true)
    }
  }, [stage])

  const drawGrid = () => {
    if (!showGrid) return null

    const gridLines = []
    const gridSize = 20

    // Vertical lines
    for (let x = 0; x <= svgWidth; x += gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={svgHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      )
    }

    // Horizontal lines
    for (let y = 0; y <= svgHeight; y += gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={svgWidth}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      )
    }

    return <g>{gridLines}</g>
  }

  const drawCoordinates = () => {
    if (!showCoordinates || shapeData.points.length === 0) return null

    return (
      <g>
        {shapeData.points.map((point, i) => (
          <g key={`coord-${i}`}>
            <circle cx={point.x} cy={point.y} r="3" fill="#ef4444" />
            <text x={point.x + 8} y={point.y - 8} fontSize="10" fill="#ef4444">
              ({Math.round(point.x)}, {Math.round(point.y)})
            </text>
          </g>
        ))}
      </g>
    )
  }

  const drawDimensions = () => {
    if (!showDimensions) return null

    const dimensions = []

    if (shape === "triangle") {
      const base = size * 30
      const height = size * 25
      
      // Base dimension
      dimensions.push(
        <g key="base-dim">
          <line
            x1={centerX - base / 2}
            y1={centerY + height / 2 + 20}
            x2={centerX + base / 2}
            y2={centerY + height / 2 + 20}
            stroke="#6b7280"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text x={centerX} y={centerY + height / 2 + 35} textAnchor="middle" fontSize="12" fill="#6b7280">
            底 = {base}
          </text>
        </g>
      )

      // Height dimension
      dimensions.push(
        <g key="height-dim">
          <line
            x1={centerX + base / 2 + 20}
            y1={centerY - height / 2}
            x2={centerX + base / 2 + 20}
            y2={centerY + height / 2}
            stroke="#6b7280"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text x={centerX + base / 2 + 35} y={centerY} textAnchor="middle" fontSize="12" fill="#6b7280">
            高 = {height}
          </text>
        </g>
      )
    } else if (shape === "rectangle") {
      const width = size * 40
      const height = size * 25
      
      dimensions.push(
        <g key="width-dim">
          <line
            x1={centerX - width / 2}
            y1={centerY - height / 2 - 20}
            x2={centerX + width / 2}
            y2={centerY - height / 2 - 20}
            stroke="#6b7280"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text x={centerX} y={centerY - height / 2 - 25} textAnchor="middle" fontSize="12" fill="#6b7280">
            长 = {width}
          </text>
        </g>
      )

      dimensions.push(
        <g key="rect-height-dim">
          <line
            x1={centerX + width / 2 + 20}
            y1={centerY - height / 2}
            x2={centerX + width / 2 + 20}
            y2={centerY + height / 2}
            stroke="#6b7280"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text x={centerX + width / 2 + 35} y={centerY} textAnchor="middle" fontSize="12" fill="#6b7280">
            宽 = {height}
          </text>
        </g>
      )
    } else if (shape === "circle" && shapeData.radius) {
      dimensions.push(
        <g key="radius-dim">
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + shapeData.radius}
            y2={centerY}
            stroke="#6b7280"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <text x={centerX + shapeData.radius / 2} y={centerY - 5} textAnchor="middle" fontSize="12" fill="#6b7280">
            r = {shapeData.radius}
          </text>
        </g>
      )
    }

    return <g>{dimensions}</g>
  }

  return (
    <svg width={svgWidth} height={svgHeight} className="svg-panel">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
      </defs>

      {/* Title */}
      <text x={svgWidth / 2} y={25} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">
        {shape === "triangle" ? "三角形" : shape === "rectangle" ? "矩形" : shape === "circle" ? "圆形" : "六边形"}几何演示
      </text>

      {/* Grid */}
      {drawGrid()}

      {/* Main shape */}
      <g>
        {/* Shape fill (highlighted area) */}
        {highlightArea && (
          <path
            d={shapeData.path}
            fill="#3b82f6"
            fillOpacity="0.3"
            stroke="none"
          />
        )}

        {/* Shape outline with animation */}
        <path
          d={shapeData.path}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray={shapeData.path}
          strokeDashoffset={shapeData.path ? (1 - animationProgress) * parseFloat(shapeData.path.replace(/[^0-9.-]/g, '')) : 0}
          style={{
            transition: "stroke-dashoffset 0.3s ease"
          }}
        />

        {/* Completed shape (full outline) */}
        {animationProgress >= 1 && (
          <path
            d={shapeData.path}
            fill="none"
            stroke="#1e40af"
            strokeWidth="3"
          />
        )}
      </g>

      {/* Coordinates */}
      {drawCoordinates()}

      {/* Dimensions */}
      {drawDimensions()}

      {/* Properties display */}
      {stage >= 2 && (
        <g transform={`translate(${svgWidth - 150}, ${60})`}>
          <rect x={0} y={0} width={140} height={100} fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" rx="5" />
          <text x={70} y={20} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1f2937">
            图形属性
          </text>
          <text x={10} y={40} fontSize="12" fill="#6b7280">
            面积 ≈ {shapeData.area.toFixed(1)}
          </text>
          <text x={10} y="60" fontSize="12" fill="#6b7280">
            周长 ≈ {shapeData.perimeter.toFixed(1)}
          </text>
          {shape === "circle" && shapeData.radius && (
            <text x={10} y="80" fontSize="12" fill="#6b7280">
              半径 = {shapeData.radius}
            </text>
          )}
        </g>
      )}

      {/* Area highlight explanation */}
      {highlightArea && (
        <g transform={`translate(${svgWidth / 2}, ${svgHeight - 40})`}>
          <rect x={-100} y={-15} width={200} height={30} fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" rx="5" />
          <text x={0} y={5} textAnchor="middle" fontSize="12" fill="#1e40af">
            蓝色区域表示图形面积
          </text>
        </g>
      )}
    </svg>
  )
}