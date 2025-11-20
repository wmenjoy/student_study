export type Cell = { value?: number; fixed?: boolean }
export type Clue = { r: number; c: number; value: number }
export type Level = { id: string; name: string; rows: number; cols: number; clues: Clue[] }

export type ValidationError =
    | { type: "incomplete"; cells: string[] }
    | { type: "wrongSize"; value: number; expected: number; actual: number; cells: string[] }
    | { type: "touching"; value: number; cells: string[] }

export class FillingEngine {
    private level: Level

    constructor(level: Level) {
        this.level = level
    }

    createEmptyBoard(): Cell[][] {
        return Array.from({ length: this.level.rows }, () => Array.from({ length: this.level.cols }, () => ({})))
    }

    key(r: number, c: number) {
        return `${r},${c}`
    }

    parseKey(key: string): [number, number] {
        const [rs, cs] = key.split(",")
        return [Number(rs), Number(cs)]
    }

    neighbors4(r: number, c: number): [number, number][] {
        const res: [number, number][] = []
        if (r > 0) res.push([r - 1, c])
        if (r < this.level.rows - 1) res.push([r + 1, c])
        if (c > 0) res.push([r, c - 1])
        if (c < this.level.cols - 1) res.push([r, c + 1])
        return res
    }

    neighbors8(r: number, c: number): [number, number][] {
        const res: [number, number][] = []
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue
                const nr = r + dr
                const nc = c + dc
                if (nr >= 0 && nr < this.level.rows && nc >= 0 && nc < this.level.cols) {
                    res.push([nr, nc])
                }
            }
        }
        return res
    }

    isComplete(board: Cell[][]): boolean {
        for (let r = 0; r < this.level.rows; r++) {
            for (let c = 0; c < this.level.cols; c++) {
                if (board[r][c].value === undefined) return false
            }
        }
        return true
    }

    validate(board: Cell[][]): ValidationError[] {
        const errors: ValidationError[] = []
        if (!board.length) return errors

        // 1. 检查空格
        const incomplete: string[] = []
        for (let r = 0; r < this.level.rows; r++) {
            for (let c = 0; c < this.level.cols; c++) {
                if (!board[r] || !board[r][c]) continue
                if (board[r][c].value === undefined) incomplete.push(this.key(r, c))
            }
        }
        if (incomplete.length) errors.push({ type: "incomplete", cells: incomplete })

        // 2. 按值分组并检查连通性与面积
        const valueCells = new Map<number, string[]>()
        for (let r = 0; r < this.level.rows; r++) {
            for (let c = 0; c < this.level.cols; c++) {
                if (!board[r] || !board[r][c]) continue
                const v = board[r][c].value
                if (v === undefined) continue
                if (!valueCells.has(v)) valueCells.set(v, [])
                valueCells.get(v)!.push(this.key(r, c))
            }
        }

        for (const [value, cells] of valueCells.entries()) {
            const visited = new Set<string>()
            const components: string[][] = []

            for (const key of cells) {
                if (visited.has(key)) continue
                const queue = [key]
                const component: string[] = []
                visited.add(key)
                while (queue.length) {
                    const cur = queue.shift()!
                    component.push(cur)
                    const [r, c] = this.parseKey(cur)
                    for (const [nr, nc] of this.neighbors4(r, c)) {
                        const nk = this.key(nr, nc)
                        if (!visited.has(nk) && board[nr][nc].value === value) {
                            visited.add(nk)
                            queue.push(nk)
                        }
                    }
                }
                components.push(component)
            }

            // 面积匹配
            const clue = this.level.clues.find((c) => c.value === value)
            const expected = clue ? clue.value : 0
            for (const comp of components) {
                if (comp.length !== expected) {
                    errors.push({ type: "wrongSize", value, expected, actual: comp.length, cells: comp })
                }
            }

            // 同值接触（含对角）
            const allValueKeys = new Set(cells)
            for (const key of cells) {
                const [r, c] = this.parseKey(key)
                for (const [nr, nc] of this.neighbors8(r, c)) {
                    if (!board[nr] || !board[nr][nc]) continue
                    const nk = this.key(nr, nc)
                    if (allValueKeys.has(nk)) {
                        const dr = Math.abs(nr - r)
                        const dc = Math.abs(nc - c)
                        if (dr === 1 && dc === 1) {
                            // 对角接触
                            errors.push({ type: "touching", value, cells: [key, nk] })
                        }
                    }
                }
            }
        }

        return errors
    }

    solve(): Cell[][] {
        // 简单演示：返回一个已知的解答（与旧 solution 映射一致）
        const board = this.createEmptyBoard()
        // 仅 5x5-1 有预设解，其余返回空板
        if (this.level.id === "5x5-1") {
            const sol: Record<string, number> = {
                "0,0": 5, "0,1": 5, "1,0": 5, "1,1": 5, "2,0": 5,
                "0,4": 2, "1,4": 2,
                "2,2": 1,
                "4,0": 4, "3,0": 4, "3,1": 4, "4,1": 4,
                "4,4": 5, "4,3": 5, "3,4": 5, "3,3": 5, "2,4": 5,
                "1,2": 3, "0,2": 3, "0,3": 3,
                "3,2": 5, "2,1": 5, "2,3": 5, "1,3": 5, "4,2": 5,
            }
            Object.entries(sol).forEach(([key, v]) => {
                const [r, c] = this.parseKey(key)
                board[r][c] = { value: v, fixed: false }
            })
            this.level.clues.forEach((clue) => {
                board[clue.r][clue.c].fixed = true
            })
        }
        return board
    }
}