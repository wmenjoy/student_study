import { useEffect } from "react"
import { MinesEngine, Board } from "./MinesEngine"

type Props = {
  board: Board
  planted: boolean
  onPlant: (excludeIndex: number) => void
  onReveal: (next: Board) => void
  onChord: (next: Board) => void
  onFlag: (next: Board) => void
}

export function MinesBoard({ board, planted, onPlant, onReveal, onChord, onFlag }: Props) {
  const engine = new MinesEngine(board.rows, board.cols, board.mineCount)

  const clickCell = (i: number, chord = false) => {
    if (board.exploded) return
    if (!planted) { onPlant(i); return }
    if (chord) { onChord(engine.chordReveal(board, i)); return }
    onReveal(engine.reveal(board, i))
  }

  const rightClickCell = (i: number) => {
    if (board.exploded) return
    onFlag(engine.toggleFlag(board, i))
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Space") e.preventDefault()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div className="mines-board" style={{ gridTemplateColumns: `repeat(${board.cols}, 1fr)` } as React.CSSProperties}>
      {Array.from({ length: board.rows * board.cols }, (_, i) => {
        const isOpen = !!board.revealed[i]
        const isFlag = !!board.flagged[i]
        const isMine = !!board.mines[i]
        const n = board.numbers[i]
        const cls = ["cell", isOpen && "open", isFlag && "flag", board.exploded && isMine && "mine", isOpen && n === 0 && "zero"].filter(Boolean).join(" ")
        return (
          <button
            key={i}
            className={cls}
            onClick={() => clickCell(i, false)}
            onDoubleClick={() => clickCell(i, true)}
            onContextMenu={(e) => { e.preventDefault(); rightClickCell(i) }}
            disabled={board.exploded}
            aria-label={isOpen ? (n >= 9 ? "雷" : `数字 ${n}`) : isFlag ? "旗" : "未开"}
          >
            {isOpen ? (n >= 9 ? "💣" : n === 0 ? "" : n) : isFlag ? "⚑" : ""}
          </button>
        )
      })}
    </div>
  )
}