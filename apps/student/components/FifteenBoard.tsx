import { useEffect } from "react"
import { FifteenEngine, Tiles } from "./FifteenEngine"

type Props = {
    tiles: Tiles
    size: number
    onMove: (next: Tiles) => void
}

export function FifteenBoard({ tiles, size, onMove }: Props) {
    const engine = new FifteenEngine(size)

    const moveTile = (index: number) => {
        if (!engine.canMove(index, tiles)) return
        onMove(engine.applyMove(index, tiles))
    }

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const blank = tiles.indexOf(0)
            const [r, c] = engine.indexToRC(blank)
            let targetIndex = -1
            if (e.key === "ArrowUp" && r < size - 1) {
                targetIndex = engine.rcToIndex(r + 1, c)
            } else if (e.key === "ArrowDown" && r > 0) {
                targetIndex = engine.rcToIndex(r - 1, c)
            } else if (e.key === "ArrowLeft" && c < size - 1) {
                targetIndex = engine.rcToIndex(r, c + 1)
            } else if (e.key === "ArrowRight" && c > 0) {
                targetIndex = engine.rcToIndex(r, c - 1)
            }
            if (targetIndex >= 0) moveTile(targetIndex)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [tiles, size])

    return (
        <div
            className="fifteen-board"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` } as React.CSSProperties}
        >
            {tiles.map((v, i) => (
                <button
                    key={i}
                    className={`tile ${v === 0 ? "tile-empty" : ""}`}
                    onClick={() => moveTile(i)}
                    disabled={v === 0}
                    aria-label={v === 0 ? "空格" : `数字 ${v}`}
                >
                    {v === 0 ? "" : v}
                </button>
            ))}
        </div>
    )
}