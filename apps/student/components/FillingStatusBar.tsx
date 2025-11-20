type Props = {
    levelName: string
    time: string
    errorCount: number
    isSolved: boolean
}

export function FillingStatusBar({ levelName, time, errorCount, isSolved }: Props) {
    return (
        <div className="filling-status-bar">
            <div className="status-left">
                <span className="level-name">{levelName}</span>
            </div>
            <div className="status-center">
                {isSolved && <span className="badge success">✅ 已完成</span>}
                {!isSolved && errorCount > 0 && <span className="badge error">⚠️ {errorCount} 处错误</span>}
                {!isSolved && errorCount === 0 && <span className="badge neutral">进行中</span>}
            </div>
            <div className="status-right">
                <span className="timer">{time}</span>
            </div>
        </div>
    )
}