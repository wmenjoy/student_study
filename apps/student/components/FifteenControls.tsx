type Props = {
    sizes: number[]
    size: number
    canUndo: boolean
    canRedo: boolean
    onSizeChange: (size: number) => void
    onUndo: () => void
    onRedo: () => void
    onRestart: () => void
    onNewGame: () => void
    onSolve: () => void
    solvable: boolean
}

export function FifteenControls({
    sizes,
    size,
    canUndo,
    canRedo,
    onSizeChange,
    onUndo,
    onRedo,
    onRestart,
    onNewGame,
    onSolve,
    solvable,
}: Props) {
    return (
        <div className="fifteen-controls">
            <div className="control-row">
                <label>尺寸</label>
                <select
                    value={size}
                    onChange={(e) => onSizeChange(Number(e.target.value))}
                >
                    {sizes.map((s) => (
                        <option key={s} value={s}>{s}×{s}</option>
                    ))}
                </select>
            </div>
            <div className="control-row">
                <button className="btn ghost" onClick={onUndo} disabled={!canUndo}>撤销</button>
                <button className="btn ghost" onClick={onRedo} disabled={!canRedo}>重做</button>
            </div>
            <div className="control-row">
                <button className="btn secondary" onClick={onRestart}>重启</button>
                <button className="btn secondary" onClick={onNewGame}>新建</button>
            </div>
            <div className="control-row">
                <button className="btn" onClick={onSolve}>解答</button>
            </div>
            <div className="control-row" aria-live="polite">
                {solvable ? (
                    <span className="badge success">可解</span>
                ) : (
                    <span className="badge neutral">不可解</span>
                )}
            </div>
        </div>
    )
}