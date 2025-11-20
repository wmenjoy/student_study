import { useEffect, useState } from "react"
import { Cell, ValidationError } from "./FillingEngine"

type Props = {
    board: Cell[][]
    selection: Set<string>
    errors: ValidationError[]
    onSelect: (next: Set<string>) => void
    onChange: (next: Cell[][]) => void
}

export function FillingBoard({ board, selection, errors, onSelect, onChange }: Props) {
    const [isDragging, setIsDragging] = useState(false)

    const errorKeys = new Set(errors.flatMap((e) => e.cells))

    const cellKey = (r: number, c: number) => `${r},${c}`

    const inSelection = (r: number, c: number) => selection.has(cellKey(r, c))

    const isError = (r: number, c: number) => errorKeys.has(cellKey(r, c))

    const setCellValue = (r: number, c: number, value: number | undefined) => {
        const next = board.map((row) => row.map((cell) => ({ ...cell })))
        if (next[r][c].fixed) return
        next[r][c].value = value
        onChange(next)
    }

    const applyToSelection = (value: number | undefined) => {
        const next = board.map((row) => row.map((cell) => ({ ...cell })))
        selection.forEach((key) => {
            const [r, c] = key.split(",").map(Number)
            if (!next[r][c].fixed) next[r][c].value = value
        })
        onChange(next)
    }

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (selection.size === 0) return
            if (e.key >= "1" && e.key <= "9") {
                applyToSelection(Number(e.key))
            } else if (e.key === "Backspace" || e.key === "Delete") {
                applyToSelection(undefined)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [selection, board])

    const toggleSelect = (r: number, c: number, append: boolean) => {
        const key = cellKey(r, c)
        const next = new Set(selection)
        if (append) {
            next.has(key) ? next.delete(key) : next.add(key)
        } else {
            next.clear()
            next.add(key)
        }
        onSelect(next)
    }

    const handleMouseDown = (r: number, c: number, e: React.MouseEvent) => {
        e.preventDefault()
        setIsDragging(true)
        toggleSelect(r, c, e.ctrlKey || e.metaKey)
    }

    const handleMouseEnter = (r: number, c: number) => {
        if (!isDragging) return
        toggleSelect(r, c, true)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    return (
        <div
            className="filling-board"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)` } as React.CSSProperties}
        >
            {board.map((row, r) =>
                row.map((cell, c) => {
                    const selected = inSelection(r, c)
                    const err = isError(r, c)
                    const cls = [
                        "filling-cell",
                        cell.fixed && "fixed",
                        selected && "selected",
                        err && "error",
                    ]
                        .filter(Boolean)
                        .join(" ")
                    return (
                        <button
                            key={cellKey(r, c)}
                            className={cls}
                            onMouseDown={(e) => handleMouseDown(r, c, e)}
                            onMouseEnter={() => handleMouseEnter(r, c)}
                            disabled={cell.fixed}
                        >
                            {cell.value || ""}
                        </button>
                    )
                }),
            )}
        </div>
    )
}