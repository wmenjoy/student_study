import { Level } from "./FillingEngine"

type Props = {
    levels: Level[]
    currentLevelId: string
    canUndo: boolean
    canRedo: boolean
    onLevelChange: (level: Level) => void
    onUndo: () => void
    onRedo: () => void
    onReset: () => void
    onSolve: () => void
}

export function FillingControls({
    levels,
    currentLevelId,
    canUndo,
    canRedo,
    onLevelChange,
    onUndo,
    onRedo,
    onReset,
    onSolve,
}: Props) {
    return (
        <div className="filling-controls">
            <div className="control-row">
                <label>难度</label>
                <select
                    value={currentLevelId}
                    onChange={(e) => {
                        const lvl = levels.find((l) => l.id === e.target.value)
                        if (lvl) onLevelChange(lvl)
                    }}
                >
                    {levels.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="control-row">
                <button className="btn ghost" onClick={onUndo} disabled={!canUndo}>
                    撤销
                </button>
                <button className="btn ghost" onClick={onRedo} disabled={!canRedo}>
                    重做
                </button>
            </div>
            <div className="control-row">
                <button className="btn secondary" onClick={onReset}>
                    重开
                </button>
                <button className="btn secondary" onClick={onSolve}>
                    解答
                </button>
            </div>
        </div>
    )
}