"use client"

import React, { useState, useEffect, useCallback } from 'react'

type CellType = 'number' | 'operator' | 'equals' | 'empty'
type CellData = {
    value: string
    type: CellType
    isFixed: boolean
    row: number
    col: number
    id: string
}

const GRID_SIZE = 13
const TARGET_EQUATIONS = 10

export default function MultiplicationCrosswordGame() {
    const [grid, setGrid] = useState<CellData[][]>([])
    const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null)
    const [isComplete, setIsComplete] = useState(false)
    const [solution, setSolution] = useState<CellData[][]>()

    // Initialize grid
    const initGrid = () => {
        return Array(GRID_SIZE).fill(null).map((_, r) =>
            Array(GRID_SIZE).fill(null).map((_, c) => ({
                value: '',
                type: 'empty' as CellType,
                isFixed: false,
                row: r,
                col: c,
                id: `${r}-${c}`
            }))
        )
    }

    const createGame = useCallback(() => {
        let grid = initGrid()
        const solutionGrid = initGrid()

        const equations: { r: number, c: number, dir: 'h' | 'v', len: number }[] = []

        const canPlace = (g: CellData[][], r: number, c: number, val: string) => {
            if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false
            const cell = g[r][c]
            return cell.type === 'empty' || cell.value === val
        }

        const place = (g: CellData[][], r: number, c: number, val: string) => {
            const type = (['=', '×', '÷', '+', '-'].includes(val)) ? (val === '=' ? 'equals' : 'operator') : 'number'
            g[r][c] = { ...g[r][c], value: val, type: type as CellType }
        }

        const generateEquation = () => {
            const isMult = Math.random() > 0.5
            let n1, n2, res, op
            if (isMult) {
                n1 = Math.floor(Math.random() * 9) + 1
                n2 = Math.floor(Math.random() * 9) + 1
                res = n1 * n2
                op = '×'
            } else {
                n2 = Math.floor(Math.random() * 9) + 1
                res = Math.floor(Math.random() * 9) + 1
                n1 = n2 * res
                op = '÷'
            }
            return [n1.toString(), op, n2.toString(), '=', res.toString()]
        }

        // 1. First Equation
        let eq = generateEquation()
        let startR = Math.floor(GRID_SIZE / 2)
        let startC = Math.floor((GRID_SIZE - eq.length) / 2)

        for (let i = 0; i < eq.length; i++) {
            place(solutionGrid, startR, startC + i, eq[i])
        }
        equations.push({ r: startR, c: startC, dir: 'h', len: eq.length })

        // 2. Branching
        let attempts = 0
        while (equations.length < TARGET_EQUATIONS && attempts < 500) {
            attempts++
            const sourceEq = equations[Math.floor(Math.random() * equations.length)]
            const offset = Math.floor(Math.random() * sourceEq.len)
            const r = sourceEq.r + (sourceEq.dir === 'v' ? offset : 0)
            const c = sourceEq.c + (sourceEq.dir === 'h' ? offset : 0)

            const cell = solutionGrid[r][c]
            if (cell.type !== 'number') continue

            const val = cell.value
            const newEqParts = generateEquation()
            const possibleIndices = newEqParts.map((p, i) => p === val ? i : -1).filter(i => i !== -1)
            if (possibleIndices.length === 0) continue

            const crossIndex = possibleIndices[Math.floor(Math.random() * possibleIndices.length)]
            const newDir = sourceEq.dir === 'h' ? 'v' : 'h'
            const newStartR = r - (newDir === 'v' ? crossIndex : 0)
            const newStartC = c - (newDir === 'h' ? crossIndex : 0)

            let valid = true
            for (let i = 0; i < newEqParts.length; i++) {
                const checkR = newStartR + (newDir === 'v' ? i : 0)
                const checkC = newStartC + (newDir === 'h' ? i : 0)
                if (checkR === r && checkC === c) continue

                if (!canPlace(solutionGrid, checkR, checkC, newEqParts[i])) {
                    valid = false; break;
                }
                if (solutionGrid[checkR][checkC].type !== 'empty') {
                    valid = false; break;
                }
            }

            if (valid) {
                for (let i = 0; i < newEqParts.length; i++) {
                    place(solutionGrid, newStartR + (newDir === 'v' ? i : 0), newStartC + (newDir === 'h' ? i : 0), newEqParts[i])
                }
                equations.push({ r: newStartR, c: newStartC, dir: newDir, len: newEqParts.length })
            }
        }

        // Create playable grid
        grid = solutionGrid.map(row => row.map(cell => ({ ...cell })))
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.type !== 'empty') {
                    if (cell.value === '=') {
                        cell.isFixed = true
                    } else {
                        if (Math.random() > 0.25) {
                            cell.isFixed = false
                            cell.value = ''
                        } else {
                            cell.isFixed = true
                        }
                    }
                }
            })
        })

        return { grid, solution: solutionGrid }
    }, [])

    const startNewGame = useCallback(() => {
        const { grid: newGrid, solution: newSolution } = createGame()
        setGrid(newGrid)
        setSolution(newSolution)
        setIsComplete(false)
        setSelectedCell(null)
    }, [createGame])

    useEffect(() => {
        startNewGame()
    }, [startNewGame])

    const handleCellClick = (r: number, c: number) => {
        if (grid[r][c].type !== 'empty' && !grid[r][c].isFixed) {
            setSelectedCell({ r, c })
        }
    }

    const handleInput = (val: string) => {
        if (!selectedCell) return
        const { r, c } = selectedCell

        const newGrid = grid.map(row => row.map(cell => ({ ...cell })))
        const currentVal = newGrid[r][c].value

        if (val === 'backspace') {
            newGrid[r][c].value = currentVal.slice(0, -1)
        } else if (['×', '÷'].includes(val)) {
            newGrid[r][c].value = val
        } else {
            // Number input
            // If current value is an operator, replace it
            if (['×', '÷', '=', '+', '-'].includes(currentVal)) {
                newGrid[r][c].value = val
            } else {
                // Append if less than 2 digits
                if (currentVal.length < 2) {
                    newGrid[r][c].value = currentVal + val
                }
            }
        }
        setGrid(newGrid)

        checkCompletion(newGrid)
    }

    const checkCompletion = (currentGrid: CellData[][]) => {
        let allCorrect = true
        let filledCount = 0
        let totalToFill = 0

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentGrid[r][c].type !== 'empty' && !currentGrid[r][c].isFixed) {
                    totalToFill++
                    if (currentGrid[r][c].value !== '') {
                        filledCount++
                        if (currentGrid[r][c].value !== solution![r][c].value) {
                            allCorrect = false
                        }
                    } else {
                        allCorrect = false
                    }
                }
            }
        }

        if (allCorrect && filledCount === totalToFill) {
            setIsComplete(true)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '16px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>九九乘除法棋盘格</h1>
                <button
                    onClick={startNewGame}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500
                    }}
                >
                    🔄 新游戏
                </button>
            </div>

            <div style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '2px solid #dbeafe'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    gap: '4px',
                    width: 'min(90vw, 600px)',
                    height: 'min(90vw, 600px)'
                }}>
                    {grid.map((row, r) => (
                        row.map((cell, c) => {
                            const isSelected = selectedCell?.r === r && selectedCell?.c === c
                            const isEditable = !cell.isFixed && cell.type !== 'empty'

                            let bg = 'transparent'
                            let color = '#1e293b'
                            let border = 'none'
                            let cursor = 'default'

                            if (cell.type !== 'empty') {
                                if (cell.isFixed) {
                                    bg = '#dbeafe' // blue-100
                                    color = '#1e40af' // blue-800
                                    border = '1px solid #bfdbfe'
                                } else {
                                    bg = 'white'
                                    border = '2px solid #bfdbfe'
                                    color = '#2563eb'
                                    cursor = 'pointer'
                                }

                                if (isSelected) {
                                    bg = '#fef9c3' // yellow-100
                                    border = '2px solid #facc15' // yellow-400
                                }
                                if (isComplete) {
                                    bg = '#dcfce7' // green-100
                                    color = '#15803d' // green-700
                                    border = '1px solid #86efac'
                                }
                            }

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    onClick={() => handleCellClick(r, c)}
                                    style={{
                                        aspectRatio: '1/1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'clamp(12px, 2.5vw, 20px)',
                                        fontWeight: 'bold',
                                        borderRadius: '6px',
                                        transition: 'all 0.2s',
                                        background: bg,
                                        color: color,
                                        border: border,
                                        cursor: cursor
                                    }}
                                >
                                    {cell.value}
                                </div>
                            )
                        })
                    ))}
                </div>
            </div>

            {/* Input Pad */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                width: '100%',
                maxWidth: '300px'
            }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleInput(num.toString())}
                        disabled={isComplete || !selectedCell}
                        style={{
                            height: '56px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            cursor: (isComplete || !selectedCell) ? 'not-allowed' : 'pointer',
                            opacity: (isComplete || !selectedCell) ? 0.5 : 1,
                            color: '#334155',
                            boxShadow: '0 2px 0 #cbd5e1'
                        }}
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={() => handleInput('0')}
                    disabled={isComplete || !selectedCell}
                    style={{
                        height: '56px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        cursor: (isComplete || !selectedCell) ? 'not-allowed' : 'pointer',
                        opacity: (isComplete || !selectedCell) ? 0.5 : 1,
                        color: '#334155',
                        boxShadow: '0 2px 0 #cbd5e1'
                    }}
                >
                    0
                </button>
                <button
                    onClick={() => handleInput('backspace')}
                    disabled={isComplete || !selectedCell}
                    style={{
                        height: '56px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        cursor: (isComplete || !selectedCell) ? 'not-allowed' : 'pointer',
                        opacity: (isComplete || !selectedCell) ? 0.5 : 1,
                        color: '#ef4444',
                        boxShadow: '0 2px 0 #fca5a5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ⌫
                </button>
                <button
                    onClick={() => handleInput('×')}
                    disabled={isComplete || !selectedCell}
                    style={{
                        height: '56px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        borderRadius: '12px',
                        cursor: (isComplete || !selectedCell) ? 'not-allowed' : 'pointer',
                        opacity: (isComplete || !selectedCell) ? 0.5 : 1,
                        color: '#ea580c',
                        boxShadow: '0 2px 0 #fdba74'
                    }}
                >
                    ×
                </button>
                <button
                    onClick={() => handleInput('÷')}
                    disabled={isComplete || !selectedCell}
                    style={{
                        height: '56px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        borderRadius: '12px',
                        cursor: (isComplete || !selectedCell) ? 'not-allowed' : 'pointer',
                        opacity: (isComplete || !selectedCell) ? 0.5 : 1,
                        color: '#ea580c',
                        boxShadow: '0 2px 0 #fdba74'
                    }}
                >
                    ÷
                </button>
            </div>

            {isComplete && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50
                }}>
                    <div style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        animation: 'scaleIn 0.3s ease-out'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>太棒了!</h2>
                        <p style={{ color: '#4b5563', marginBottom: '24px' }}>你完成了所有题目!</p>
                        <button
                            onClick={startNewGame}
                            style={{
                                padding: '12px 32px',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
                        >
                            再玩一次
                        </button>
                    </div>
                </div>
            )}
            <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    )
}
