"use client"

import { useEffect, useMemo, useState } from "react"
import confetti from "canvas-confetti"
import { FifteenEngine, Tiles } from "./FifteenEngine"
import { FifteenBoard } from "./FifteenBoard"
import { FifteenControls } from "./FifteenControls"
import { FifteenStatusBar } from "./FifteenStatusBar"
import "./Fifteen.css"

const SIZES = [3, 4, 5, 6]

export function FifteenGame() {
    const [size, setSize] = useState<number>(4)
    const engine = useMemo(() => new FifteenEngine(size), [size])

    const [tiles, setTiles] = useState<Tiles>([])
    const [initialTiles, setInitialTiles] = useState<Tiles>([])
    const [history, setHistory] = useState<Tiles[]>([])
    const [historyIndex, setHistoryIndex] = useState<number>(-1)
    const [seconds, setSeconds] = useState<number>(0)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [isSolved, setIsSolved] = useState<boolean>(false)
    const [moves, setMoves] = useState<number>(0)

    useEffect(() => { newGame() }, [size])

    useEffect(() => {
        if (!isRunning || isSolved) return
        const id = setInterval(() => setSeconds((s) => s + 1), 1000)
        return () => clearInterval(id)
    }, [isRunning, isSolved])

    useEffect(() => {
        if (!tiles.length) return
        setIsSolved(engine.isSolved(tiles))
    }, [tiles, engine])

    useEffect(() => {
        if (isSolved) {
            setIsRunning(false)
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
        }
    }, [isSolved])

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, "0")}`
    }

    const newGame = () => {
        const t = engine.randomWalkScramble(200)
        setTiles(t)
        setInitialTiles(t)
        setHistory([t])
        setHistoryIndex(0)
        setSeconds(0)
        setMoves(0)
        setIsSolved(false)
        setIsRunning(true)
    }

    const restart = () => {
        const t = initialTiles.slice()
        setTiles(t)
        setHistory([t])
        setHistoryIndex(0)
        setSeconds(0)
        setMoves(0)
        setIsSolved(false)
        setIsRunning(true)
    }

    const pushHistory = (next: Tiles, countMove = true) => {
        const past = history.slice(0, historyIndex + 1)
        const nextHistory = [...past, next]
        setHistory(nextHistory)
        setHistoryIndex(nextHistory.length - 1)
        setTiles(next)
        if (countMove) setMoves((m) => m + 1)
    }

    const undo = () => {
        if (historyIndex <= 0) return
        const prev = history[historyIndex - 1]
        setHistoryIndex(historyIndex - 1)
        setTiles(prev)
        setMoves((m) => (m > 0 ? m - 1 : 0))
    }

    const redo = () => {
        if (historyIndex >= history.length - 1) return
        const next = history[historyIndex + 1]
        setHistoryIndex(historyIndex + 1)
        setTiles(next)
        setMoves((m) => m + 1)
    }

    const solve = () => {
        const sol = engine.createSolved()
        pushHistory(sol, false)
    }

    return (
        <div className="fifteen">
            <FifteenStatusBar
                sizeLabel={`${size}×${size}`}
                time={formatTime(seconds)}
                moves={moves}
                isSolved={isSolved}
            />
            <div className="fifteen-body">
                <FifteenBoard
                    tiles={tiles}
                    size={size}
                    onMove={(next) => pushHistory(next)}
                />
                <aside className="fifteen-sidebar">
                    <FifteenControls
                        sizes={SIZES}
                        size={size}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                        onSizeChange={setSize}
                        onUndo={undo}
                        onRedo={redo}
                        onRestart={restart}
                        onNewGame={newGame}
                        onSolve={solve}
                        solvable={engine.isSolvable(tiles)}
                    />
                </aside>
            </div>
            {isSolved && (
                <div className="fifteen-overlay">
                    <div className="fifteen-modal">
                        <div className="text-4xl mb-2">🎉</div>
                        <h2 className="text-xl font-bold mb-1">完成！</h2>
                        <p className="text-sm text-slate-600 mb-4">用时 {formatTime(seconds)} · 步数 {moves}</p>
                        <div className="flex gap-2">
                            <button className="btn primary" onClick={newGame}>新建随机局</button>
                            <button className="btn ghost" onClick={restart}>再玩一次</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}