"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  defective: number
  stage: number
  total?: number // Default 8
  mode?: "sim" | "tree"
  strategy?: "ternary" | "binary"
}

export function DefectGumBalance({ defective, stage, total = 8, mode = "sim", strategy = "ternary" }: Props) {
  // Dynamic Grouping Logic
  const isSmall = total <= 3

  // Calculate Group Sizes for Weighing 1
  let w1_size = 1
  if (isSmall) {
    w1_size = 1
  } else if (strategy === "binary") {
    w1_size = Math.floor(total / 2)
  } else {
    // Ternary: Try to split into 3 equal parts. 
    // For 8: 3 vs 3 (Rem 2). ceil(8/3) = 3.
    // For 9: 3 vs 3 (Rem 3). ceil(9/3) = 3.
    // For 4: 2 vs 2 (Rem 0). ceil(4/3) = 2.
    w1_size = Math.ceil(total / 3)
  }

  // Groups for Weighing 1
  const g1_L = Array.from({ length: w1_size }, (_, i) => i)
  const g1_R = Array.from({ length: w1_size }, (_, i) => i + w1_size)
  const g1_Rem = Array.from({ length: total - 2 * w1_size }, (_, i) => i + 2 * w1_size)

  // Determine outcome of W1
  const w1_res = g1_L.includes(defective) ? "left" : g1_R.includes(defective) ? "right" : "equal"

  // Suspects after W1
  const suspects1 = w1_res === "left" ? g1_L : w1_res === "right" ? g1_R : g1_Rem

  // Groups for Weighing 2 (Recursive logic on suspects1)
  // We apply the same strategy to the suspects
  const s1_total = suspects1.length
  let w2_size = 1
  if (s1_total <= 1) {
    w2_size = 0 // No second weighing needed
  } else if (s1_total <= 3) {
    w2_size = 1
  } else if (strategy === "binary") {
    w2_size = Math.floor(s1_total / 2)
  } else {
    w2_size = Math.ceil(s1_total / 3)
  }

  const g2_L = w2_size > 0 ? suspects1.slice(0, w2_size) : []
  const g2_R = w2_size > 0 ? suspects1.slice(w2_size, 2 * w2_size) : []
  const g2_Rem = w2_size > 0 ? suspects1.slice(2 * w2_size) : []

  const w2_res = g2_L.includes(defective) ? "left" : g2_R.includes(defective) ? "right" : "equal"

  // Final Suspect
  const finalSuspect = w2_res === "left" ? g2_L[0] : w2_res === "right" ? g2_R[0] : (g2_Rem[0] ?? -1)

  // --- Visualization Constants ---
  const width = 600
  const height = 360

  // --- SIMULATION VIEW ---
  const getSimPos = (i: number, st: number) => {
    const spacing = 50
    const startX = (width - (total * spacing)) / 2 + 25
    const rowY = 50

    if (st === 0) {
      return { x: startX + i * spacing, y: rowY, scale: 1, opacity: 1 }
    }

    if (st === 1) {
      // Weighing 1
      if (g1_L.includes(i)) {
        const idx = g1_L.indexOf(i)
        const offset = (g1_L.length - 1) * 15
        return { x: 200 + idx * 30 - offset, y: 180 + (w1_res === "left" ? 20 : w1_res === "right" ? -20 : 0), scale: 1, opacity: 1 }
      }
      if (g1_R.includes(i)) {
        const idx = g1_R.indexOf(i)
        const offset = (g1_R.length - 1) * 15
        return { x: 400 + idx * 30 - offset, y: 180 + (w1_res === "right" ? 20 : w1_res === "left" ? -20 : 0), scale: 1, opacity: 1 }
      }
      // Remainder
      const idx = g1_Rem.indexOf(i)
      if (idx !== -1) {
        const offset = (g1_Rem.length - 1) * 15
        return { x: 300 + idx * 30 - offset, y: 280, scale: 0.8, opacity: 0.5 }
      }
      return { x: startX + i * spacing, y: rowY, scale: 0.5, opacity: 0.2 }
    }

    if (st === 2) {
      // Weighing 2
      if (!suspects1.includes(i)) return { x: startX + i * spacing, y: rowY, scale: 0.5, opacity: 0.1 }

      if (g2_L.includes(i)) {
        const idx = g2_L.indexOf(i)
        const offset = (g2_L.length - 1) * 15
        return { x: 200 + idx * 30 - offset, y: 180 + (w2_res === "left" ? 20 : w2_res === "right" ? -20 : 0), scale: 1, opacity: 1 }
      }
      if (g2_R.includes(i)) {
        const idx = g2_R.indexOf(i)
        const offset = (g2_R.length - 1) * 15
        return { x: 400 + idx * 30 - offset, y: 180 + (w2_res === "right" ? 20 : w2_res === "left" ? -20 : 0), scale: 1, opacity: 1 }
      }
      if (g2_Rem.includes(i)) {
        const idx = g2_Rem.indexOf(i)
        const offset = (g2_Rem.length - 1) * 15
        return { x: 300 + idx * 30 - offset, y: 280, scale: 0.8, opacity: 0.5 }
      }
      return { x: startX + i * spacing, y: rowY, scale: 0.5, opacity: 0.1 }
    }

    if (st >= 3) {
      // Result
      if (i === defective) return { x: 300, y: 150, scale: 2, opacity: 1 }
      return { x: startX + i * spacing, y: rowY, scale: 0.5, opacity: 0.1 }
    }

    return { x: 0, y: 0, scale: 1, opacity: 1 }
  }

  // --- TREE VIEW ---
  const TreeNode = ({ x, y, items, label, active, highlight, children }: any) => {
    return (
      <g>
        {/* Connection Lines */}
        {children && children.map((child: any, idx: number) => (
          <path
            key={idx}
            d={`M${x},${y + 20} C${x},${y + 50} ${child.x},${y - 30} ${child.x},${child.y - 20}`}
            fill="none"
            stroke={child.highlight ? "#3b82f6" : "#cbd5e1"}
            strokeWidth={child.highlight ? 3 : 1}
            strokeDasharray={child.highlight ? "none" : "4 4"}
          />
        ))}

        {/* Node Body */}
        <rect
          x={x - 40} y={y - 20} width={80} height={40} rx={20}
          fill={active ? "#eff6ff" : "white"}
          stroke={highlight ? "#3b82f6" : "#cbd5e1"}
          strokeWidth={highlight ? 3 : 1}
        />
        <text x={x} y={y} dy={5} textAnchor="middle" fontSize="12" fontWeight="bold" fill={highlight ? "#1e40af" : "#64748b"}>
          {items.length <= 4 ? items.map((n: number) => n + 1).join(",") : `${items.length}瓶`}
        </text>
        {label && <text x={x} y={y - 25} textAnchor="middle" fontSize="10" fill="#94a3b8">{label}</text>}
      </g>
    )
  }

  const renderTree = () => {
    // Root
    const root = { x: 300, y: 50, items: Array.from({ length: total }, (_, i) => i), highlight: true, active: stage === 0 }

    // Level 1 Nodes
    const l1_nodes: any[] = []
    // Left
    l1_nodes.push({
      x: 150, y: 150, items: g1_L, label: "左盘",
      highlight: w1_res === 'left', active: stage === 1 && w1_res === 'left'
    })
    // Right
    l1_nodes.push({
      x: 450, y: 150, items: g1_R, label: "右盘",
      highlight: w1_res === 'right', active: stage === 1 && w1_res === 'right'
    })
    // Remainder (if any)
    if (g1_Rem.length > 0) {
      l1_nodes.push({
        x: 300, y: 150, items: g1_Rem, label: "剩下",
        highlight: w1_res === 'equal', active: stage === 1 && w1_res === 'equal'
      })
    }

    // Level 2 Nodes (Only for the highlighted path of Level 1)
    const l2_nodes: any[] = []
    if (stage >= 2) {
      // We only expand the path that contains the defective item (which is suspects1)
      // But for the tree visualization, we should ideally show the structure. 
      // However, space is limited. Let's show the expansion of the *current* path.

      const parentX = w1_res === 'left' ? 150 : w1_res === 'right' ? 450 : 300

      if (g2_L.length > 0) {
        l2_nodes.push({
          x: parentX - 60, y: 250, items: g2_L, label: "左",
          highlight: w2_res === 'left', active: stage >= 2 && w2_res === 'left'
        })
        l2_nodes.push({
          x: parentX + 60, y: 250, items: g2_R, label: "右",
          highlight: w2_res === 'right', active: stage >= 2 && w2_res === 'right'
        })
        if (g2_Rem.length > 0) {
          l2_nodes.push({
            x: parentX, y: 250, items: g2_Rem, label: "剩",
            highlight: w2_res === 'equal', active: stage >= 2 && w2_res === 'equal'
          })
        }
      } else if (suspects1.length === 1) {
        // Directly found
        l2_nodes.push({
          x: parentX, y: 250, items: suspects1, label: "结果", highlight: true, active: true
        })
      }
    }

    return (
      <g>
        <TreeNode {...root} children={l1_nodes} />
        {l1_nodes.map((node, i) => (
          <TreeNode key={i} {...node} children={node.highlight ? l2_nodes : []} />
        ))}
        {l2_nodes.map((node, i) => (
          <TreeNode key={`l2-${i}`} {...node} />
        ))}

        {/* Final Result Highlight */}
        {stage >= 3 && (
          <g transform={`translate(${300}, ${320})`}>
            <text textAnchor="middle" fontSize="16" fontWeight="bold" fill="#ef4444">
              次品是 {defective + 1} 号
            </text>
          </g>
        )}
      </g>
    )
  }

  // Draw Scale Helper
  const DrawScale = ({ res }: { res: "left" | "right" | "equal" }) => {
    const angle = res === "left" ? -15 : res === "right" ? 15 : 0
    return (
      <g transform={`translate(300, 220)`}>
        <path d="M-20,60 L20,60 L5,0 L-5,0 Z" fill="#94a3b8" />
        <g transform={`rotate(${angle})`}>
          <rect x={-120} y={-2} width={240} height={4} fill="#475569" rx={2} />
          <g transform="translate(-100, 0)">
            <line x1={0} y1={0} x2={0} y2={40} stroke="#cbd5e1" strokeWidth="2" />
            <path d="M-30,40 Q0,55 30,40" fill="none" stroke="#475569" strokeWidth="2" />
          </g>
          <g transform="translate(100, 0)">
            <line x1={0} y1={0} x2={0} y2={40} stroke="#cbd5e1" strokeWidth="2" />
            <path d="M-30,40 Q0,55 30,40" fill="none" stroke="#475569" strokeWidth="2" />
          </g>
        </g>
      </g>
    )
  }

  return (
    <div className="relative w-full h-[360px] bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <text x={20} y={30} fontSize="16" fontWeight="bold" fill="#64748b">
          {stage === 0 && "准备：观察所有口香糖"}
          {stage === 1 && "第一次称重：分组比较"}
          {stage === 2 && "第二次称重：锁定目标"}
          {stage >= 3 && "结果：找到次品"}
        </text>

        {mode === "sim" ? (
          <>
            {(stage === 1 || stage === 2) && (
              <DrawScale res={stage === 1 ? w1_res : w2_res} />
            )}
            {Array.from({ length: total }).map((_, i) => {
              const pos = getSimPos(i, stage)
              const isDefective = i === defective
              return (
                <g key={i} style={{ transition: "all 0.8s ease-in-out", transform: `translate(${pos.x}px, ${pos.y}px) scale(${pos.scale})`, opacity: pos.opacity }}>
                  <rect x={-15} y={-25} width={30} height={40} rx={4} fill={isDefective && stage >= 3 ? "#ef4444" : "#3b82f6"} stroke="white" strokeWidth="2" />
                  <rect x={-10} y={-30} width={20} height={5} fill="#1e40af" />
                  <text x={0} y={5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{i + 1}</text>
                  {stage >= 3 && isDefective && (
                    <text x={0} y={30} textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">轻!</text>
                  )}
                </g>
              )
            })}
            {stage === 1 && (
              <g>
                <text x={200} y={120} textAnchor="middle" fontSize="12" fill="#64748b">A组 ({g1_L.length})</text>
                <text x={400} y={120} textAnchor="middle" fontSize="12" fill="#64748b">B组 ({g1_R.length})</text>
                {g1_Rem.length > 0 && (
                  <text x={300} y={270} textAnchor="middle" fontSize="12" fill="#64748b">C组 ({g1_Rem.length})</text>
                )}
              </g>
            )}
          </>
        ) : (
          renderTree()
        )}
      </svg>
    </div>
  )
}