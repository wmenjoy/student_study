"use client"
type Props = { trees: number; spacing: number; progress?: number }

export function Planting({ trees, spacing, progress = 100 }: Props) {
  const width = 640
  const height = 280
  const intervals = Math.max(0, trees - 1)
  const roadLen = intervals * spacing
  const startX = 60
  const endX = 580
  // Calculate step based on max possible trees to keep scale consistent if needed, 
  // or dynamic based on current trees. Dynamic is better for visibility.
  const step = (endX - startX) / Math.max(1, trees - 1)

  // Animation logic
  const visibleTrees = Math.floor((progress / 100) * trees)
  const showIntervals = progress > 50

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#9ca3af" />
        </marker>
      </defs>

      {/* Summary Header */}
      <g>
        <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">植树方案</text>
        <text x={24} y={56} fontSize="14" fill="#6b7280">
          棵数 = {trees} (两端都种)
        </text>
        <text x={160} y={56} fontSize="14" fill="#6b7280">
          间距 = {spacing}m
        </text>
        <text x={300} y={56} fontSize="14" fill="#6b7280">
          间隔数 = {intervals}
        </text>
        <text x={440} y={56} fontSize="16" fontWeight="bold" fill="#ef4444">
          全长 = {roadLen}m
        </text>
      </g>

      {/* Road */}
      <line x1={startX} y1={180} x2={endX} y2={180} stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
      <text x={startX} y={210} textAnchor="middle" fill="#4b5563" fontWeight="bold">起点</text>
      <text x={endX} y={210} textAnchor="middle" fill="#4b5563" fontWeight="bold">终点</text>

      {/* Trees & Intervals */}
      {[...Array(trees)].map((_, i) => {
        const x = startX + i * step
        const isVisible = i < visibleTrees || progress >= 100

        return (
          <g key={i} style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease" }}>
            {/* Tree */}
            <text x={x} y={175} textAnchor="middle" fontSize="32" style={{ transformBox: "fill-box", transformOrigin: "center bottom", animation: isVisible ? "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none" }}>🌲</text>
            <text x={x} y={140} textAnchor="middle" fontSize="12" fill="#059669">No.{i + 1}</text>

            {/* Interval (Gap) */}
            {i < trees - 1 && (
              <g style={{ opacity: showIntervals ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
                <line x1={x + 10} y1={190} x2={x + step - 10} y2={190} stroke="#f59e0b" strokeWidth="2" />
                <line x1={x + 10} y1={185} x2={x + 10} y2={195} stroke="#f59e0b" strokeWidth="2" />
                <line x1={x + step - 10} y1={185} x2={x + step - 10} y2={195} stroke="#f59e0b" strokeWidth="2" />
                <text x={x + step / 2} y={205} textAnchor="middle" fontSize="12" fill="#d97706">{spacing}m</text>
                <text x={x + step / 2} y={220} textAnchor="middle" fontSize="10" fill="#9ca3af">间隔{i + 1}</text>
              </g>
            )}
          </g>
        )
      })}

      {/* Total Length Bracket */}
      {showIntervals && (
        <g style={{ opacity: 1, transition: "opacity 0.5s ease 0.5s" }}>
          <path d={`M${startX},230 v10 h${endX - startX} v-10`} fill="none" stroke="#374151" strokeWidth="1.5" />
          <text x={startX + (endX - startX) / 2} y={260} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
            总长 = {intervals} × {spacing} = {roadLen}m
          </text>
        </g>
      )}
    </svg>
  )
}