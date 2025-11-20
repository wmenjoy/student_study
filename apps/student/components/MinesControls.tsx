type Difficulty = { name: string; rows: number; cols: number; mines: number }

type Props = {
  difficulties: Difficulty[]
  current: Difficulty
  canUndo: boolean
  canRedo: boolean
  onDifficultyChange: (d: Difficulty) => void
  onUndo: () => void
  onRedo: () => void
  onRestart: () => void
  onNew: () => void
  onSolve: () => void
}

export function MinesControls({ difficulties, current, canUndo, canRedo, onDifficultyChange, onUndo, onRedo, onRestart, onNew, onSolve }: Props) {
  return (
    <div className="mines-controls">
      <div className="control-row">
        <label>难度</label>
        <select value={current.name} onChange={(e) => {
          const d = difficulties.find(x => x.name === e.target.value)
          if (d) onDifficultyChange(d)
        }}>
          {difficulties.map(d => (
            <option key={d.name} value={d.name}>{d.name}（{d.rows}×{d.cols}/{d.mines}）</option>
          ))}
        </select>
      </div>
      <div className="control-row">
        <button className="btn ghost" onClick={onUndo} disabled={!canUndo}>撤销</button>
        <button className="btn ghost" onClick={onRedo} disabled={!canRedo}>重做</button>
      </div>
      <div className="control-row">
        <button className="btn secondary" onClick={onRestart}>重启</button>
        <button className="btn secondary" onClick={onNew}>新建</button>
      </div>
      <div className="control-row">
        <button className="btn" onClick={onSolve}>解答</button>
      </div>
    </div>
  )
}