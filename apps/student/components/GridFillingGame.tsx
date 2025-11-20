"use client"

import { useEffect, useState } from "react"
import { FillingEngine, type Level, type Cell, type ValidationError } from "./FillingEngine"
import { FillingBoard } from "./FillingBoard"
import { FillingControls } from "./FillingControls"
import { FillingStatusBar } from "./FillingStatusBar"
import "./GridFilling.css"

const LEVELS: Level[] = [
    {
        id: "5x5-1",
        name: "5×5 入门",
        rows: 5,
        cols: 5,
        clues: [
            { r: 0, c: 0, value: 5 },
            { r: 0, c: 4, value: 2 },
            { r: 2, c: 2, value: 1 },
            { r: 4, c: 0, value: 4 },
            { r: 4, c: 4, value: 5 },
            { r: 1, c: 2, value: 3 },
            { r: 3, c: 2, value: 5 },
        ],
    },
    {
        id: "7x7-1",
        name: "7×7 进阶",
        rows: 7,
        cols: 7,
        clues: [
            { r: 0, c: 0, value: 4 },
            { r: 0, c: 6, value: 3 },
            { r: 3, c: 3, value: 9 },
            { r: 6, c: 0, value: 3 },
            { r: 6, c: 6, value: 4 },
            { r: 1, c: 3, value: 2 },
            { r: 5, c: 3, value: 2 },
            { r: 3, c: 1, value: 2 },
            { r: 3, c: 5, value: 2 },
        ],
    },
    {
        id: "10x10-1",
        name: "10×10 挑战",
        rows: 10,
        cols: 10,
        clues: [
            { r: 0, c: 2, value: 4 },
            { r: 0, c: 7, value: 6 },
            { r: 1, c: 0, value: 4 },
            { r: 1, c: 5, value: 4 },
            { r: 2, c: 3, value: 4 },
            { r: 2, c: 8, value: 3 },
            { r: 3, c: 1, value: 3 },
            { r: 3, c: 6, value: 5 },
            { r: 4, c: 4, value: 6 },
            { r: 4, c: 9, value: 4 },
            { r: 5, c: 0, value: 3 },
            { r: 5, c: 5, value: 5 },
            { r: 6, c: 3, value: 5 },
            { r: 6, c: 8, value: 4 },
            { r: 7, c: 1, value: 4 },
            { r: 7, c: 6, value: 4 },
            { r: 8, c: 4, value: 3 },
            { r: 8, c: 9, value: 3 },
            { r: 9, c: 2, value: 5 },
            { r: 9, c: 7, value: 5 },
        ],
    },
]

export function GridFillingGame() {
    const [level, setLevel] = useState<Level>(LEVELS[0])
    const [board, setBoard] = useState<Cell[][]>([])
    const [selection, setSelection] = useState<Set<string>>(new Set())
    const [history, setHistory] = useState<Cell[][][]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [seconds, setSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [isSolved, setIsSolved] = useState(false)
    const [errors, setErrors] = useState<ValidationError[]>([])

    const engine = new FillingEngine(level)

    useEffect(() => {
        resetGame()
    }, [level.id])

    useEffect(() => {
        if (!isRunning || isSolved) return
        const id = setInterval(() => setSeconds((s) => s + 1), 1000)
        return () => clearInterval(id)
    }, [isRunning, isSolved])

    useEffect(() => {
        if (!board.length) return
        setErrors(engine.validate(board))
        setIsSolved(errors.length === 0 && engine.isComplete(board))
    }, [board])

    const resetGame = () => {
        const initial = engine.createEmptyBoard()
        level.clues.forEach((clue) => {
            initial[clue.r][clue.c] = { value: clue.value, fixed: true }
        })
        setBoard(initial)
        setHistory([initial])
        setHistoryIndex(0)
        setSelection(new Set())
        setSeconds(0)
        setIsRunning(true)
        setIsSolved(false)
    }

    const pushHistory = (next: Cell[][]) => {
        const past = history.slice(0, historyIndex + 1)
        const nextHistory = [...past, next]
        setHistory(nextHistory)
        setHistoryIndex(nextHistory.length - 1)
        setBoard(next)
    }

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

    const nextLevel = () => {
        const idx = LEVELS.findIndex((l) => l.id === level.id)
        if (idx < LEVELS.length - 1) setLevel(LEVELS[idx + 1])
    }

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, "0")}`
    }

    return (
        <div className="grid-filling">
            <FillingStatusBar
                levelName={level.name}
                time={formatTime(seconds)}
                errorCount={errors.length}
                isSolved={isSolved}
            />
            <div className="grid-filling-body">
                <FillingBoard
                    board={board}
                    selection={selection}
                    errors={errors}
                    onSelect={setSelection}
                    onChange={(next) => pushHistory(next)}
                />
                <aside className="grid-filling-sidebar">
                    <FillingControls
                        levels={LEVELS}
                        currentLevelId={level.id}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                        onLevelChange={setLevel}
                        onUndo={undo}
                        onRedo={redo}
                        onReset={resetGame}
                        onSolve={() => setBoard(engine.solve())}
                    />
                    <div className="grid-filling-rules">
                        <h3>规则</h3>
                        <ol>
                            <li>每个数字 n 的正交连通区域面积恰为 n</li>
                            <li>相同数字的区域互不接触（含对角）</li>
                            <li>网格完全填满</li>
                        </ol>
                    </div>
                </aside>
            </div>
            {isSolved && (
                <div className="grid-filling-overlay">
                    <div className="grid-filling-modal">
                        <div className="text-4xl mb-2">🎉</div>
                        <h2 className="text-xl font-bold mb-1">完成！</h2>
                        <p className="text-sm text-slate-600 mb-4">用时 {formatTime(seconds)}</p>
                        <div className="flex gap-2">
                            {LEVELS.findIndex((l) => l.id === level.id) < LEVELS.length - 1 && (
                                <button className="btn primary" onClick={nextLevel}>
                                    下一关
                                </button>
                            )}
                            <button className="btn ghost" onClick={resetGame}>
                                再玩一次
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
