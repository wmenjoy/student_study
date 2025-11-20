"use client"

import { useEffect, useMemo, useState } from "react"
import { MinesEngine, Board } from "./MinesEngine"
import { MinesBoard } from "./MinesBoard"
import { MinesControls } from "./MinesControls"
import { MinesStatusBar } from "./MinesStatusBar"
import "./Mines.css"

type Difficulty = { name: string; rows: number; cols: number; mines: number }

const DIFFICULTIES: Difficulty[] = [
  { name: "初级", rows: 9, cols: 9, mines: 10 },
  { name: "中级", rows: 16, cols: 16, mines: 40 },
  { name: "高级", rows: 16, cols: 30, mines: 99 },
]

export function MinesGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0])
  const engine = useMemo(() => new MinesEngine(difficulty.rows, difficulty.cols, difficulty.mines), [difficulty])
  const [board, setBoard] = useState<Board>(engine.createEmpty())
  const [planted, setPlanted] = useState(false)
  const [history, setHistory] = useState<Board[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => { newGame() }, [engine])

  useEffect(() => {
    if (!running || isWin() || isLose()) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running, board])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const pushHistory = (next: Board) => {
    const past = history.slice(0, historyIndex + 1)
    const nextHistory = [...past, next]
    setHistory(nextHistory)
    setHistoryIndex(nextHistory.length - 1)
    setBoard(next)
  }

  const newGame = () => {
    const b = engine.createEmpty()
    setBoard(b)
    setPlanted(false)
    setHistory([b])
    setHistoryIndex(0)
    setSeconds(0)
    setRunning(false)
  }

  const restart = () => {
    const b = history[0]
    setBoard(b)
    setHistory([b])
    setHistoryIndex(0)
    setPlanted(false)
    setSeconds(0)
    setRunning(false)
  }

  const plantAt = (excludeIndex: number) => {
    const plantedBoard = engine.plantMines(board, excludeIndex)
    setPlanted(true)
    setRunning(true)
    const firstOpen = engine.reveal(plantedBoard, excludeIndex)
    pushHistory(firstOpen)
  }

  const onReveal = (next: Board) => { pushHistory(next) }
  const onChord = (next: Board) => { pushHistory(next) }
  const onFlag = (next: Board) => { pushHistory(next) }

  const undo = () => {
    if (historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    setHistoryIndex(historyIndex - 1)
    setBoard(prev)
  }

  const redo = () => {
    if (historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    setHistoryIndex(historyIndex + 1)
    setBoard(next)
  }

  const isWin = () => engine.isWin(board)
  const isLose = () => board.exploded
  const marked = Array.from(board.flagged).reduce((a, b) => a + b, 0)

  const solve = () => { pushHistory(engine.solve(board)) }

  return (
    <div className="mines">
      <MinesStatusBar
        sizeLabel={`${board.rows}×${board.cols} / 雷 ${board.mineCount}`}
        time={formatTime(seconds)}
        marked={marked}
        total={board.mineCount}
        isWin={isWin()}
        isLose={isLose()}
      />
      <div className="mines-body">
        <MinesBoard
          board={board}
          planted={planted}
          onPlant={(i) => plantAt(i)}
          onReveal={(next) => onReveal(next)}
          onChord={(next) => onChord(next)}
          onFlag={(next) => onFlag(next)}
        />
        <aside className="mines-sidebar">
          <MinesControls
            difficulties={DIFFICULTIES}
            current={difficulty}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onDifficultyChange={(d) => setDifficulty(d)}
            onUndo={undo}
            onRedo={redo}
            onRestart={restart}
            onNew={newGame}
            onSolve={solve}
          />
        </aside>
      </div>
      {(isWin() || isLose()) && (
        <div className="overlay">
          <div className="modal">
            <div className="text-4xl mb-2">{isWin() ? "🎉" : "💥"}</div>
            <h2 className="text-xl font-bold mb-1">{isWin() ? "完成！" : "踩雷失败"}</h2>
            <p className="text-sm text-slate-600 mb-4">用时 {formatTime(seconds)} · 标记 {marked}/{board.mineCount}</p>
            <div className="flex gap-2">
              <button className="btn primary" onClick={newGame}>新建随机局</button>
              <button className="btn ghost" onClick={restart}>再来一次</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}