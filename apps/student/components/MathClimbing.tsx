"use client"
import { Stairs } from "./Stairs"

type Props = {
  total: number
  current: number
  status?: "idle" | "correct" | "wrong"
}

export function MathClimbing({ total, current, status = "idle" }: Props) {
  const wrapCls = status === "correct" ? "pulse" : status === "wrong" ? "shake" : ""
  return (
    <div style={{ position: "relative" }} className={wrapCls}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 4px" }}>
        <div style={{ fontWeight: 700 }}>进度：{current}/{total}</div>
        <div style={{ color: "#6b7280" }}>答对上一步，答错停留</div>
      </div>
      <Stairs from={0} to={total} timePerFloor={1} count={current} progress={current} />
      <div style={{ position: "absolute", top: 10, right: 14, fontSize: 22 }}>🚩</div>
      {current >= total && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 36 }}>🎉 太棒了！</div>
        </div>
      )}
    </div>
  )
}