type Props = { sizeLabel: string; time: string; marked: number; total: number; isWin: boolean; isLose: boolean }

export function MinesStatusBar({ sizeLabel, time, marked, total, isWin, isLose }: Props) {
  return (
    <div className="mines-status-bar">
      <div className="status-left">{sizeLabel}</div>
      <div className="status-center">
        {isWin && <span className="badge success">✅ 已完成</span>}
        {isLose && <span className="badge error">💥 踩雷</span>}
        {!isWin && !isLose && <span className="badge neutral">标记 {marked} / {total}</span>}
      </div>
      <div className="status-right"><span className="timer">{time}</span></div>
    </div>
  )
}