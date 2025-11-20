type Props = {
    sizeLabel: string
    time: string
    moves: number
    isSolved: boolean
}

export function FifteenStatusBar({ sizeLabel, time, moves, isSolved }: Props) {
    return (
        <div className="fifteen-status-bar">
            <div className="status-left">
                <span className="level-name">{sizeLabel}</span>
            </div>
            <div className="status-center">
                {isSolved ? (
                    <span className="badge success">✅ 已完成</span>
                ) : (
                    <span className="badge neutral">进行中 · 步数 {moves}</span>
                )}
            </div>
            <div className="status-right">
                <span className="timer">{time}</span>
            </div>
        </div>
    )
}