export type Tiles = number[]

export class FifteenEngine {
    size: number

    constructor(size: number) {
        this.size = size
    }

    createSolved(): Tiles {
        const n = this.size * this.size
        const arr = Array.from({ length: n - 1 }, (_, i) => i + 1)
        arr.push(0)
        return arr
    }

    indexToRC(index: number): [number, number] {
        return [Math.floor(index / this.size), index % this.size]
    }

    rcToIndex(r: number, c: number): number {
        return r * this.size + c
    }

    isSolved(tiles: Tiles): boolean {
        if (tiles.length !== this.size * this.size) return false
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] !== i + 1) return false
        }
        return tiles[tiles.length - 1] === 0
    }

    inversionCount(tiles: Tiles): number {
        const arr = tiles.filter((v) => v !== 0)
        let inv = 0
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) inv++
            }
        }
        return inv
    }

    blankRowFromBottom(tiles: Tiles): number {
        const blank = tiles.indexOf(0)
        const [r] = this.indexToRC(blank)
        return this.size - r
    }

    isSolvable(tiles: Tiles): boolean {
        const inv = this.inversionCount(tiles)
        if (this.size % 2 === 1) {
            return inv % 2 === 0
        }
        const blankRow = this.blankRowFromBottom(tiles)
        // 偶数宽度：空格自底部行数为偶且逆序为奇，或为空格行数为奇且逆序为偶
        return (blankRow % 2 === 0 && inv % 2 === 1) || (blankRow % 2 === 1 && inv % 2 === 0)
    }

    neighborsOfBlank(tiles: Tiles): number[] {
        const res: number[] = []
        const blank = tiles.indexOf(0)
        const [r, c] = this.indexToRC(blank)
        if (r > 0) res.push(this.rcToIndex(r - 1, c))
        if (r < this.size - 1) res.push(this.rcToIndex(r + 1, c))
        if (c > 0) res.push(this.rcToIndex(r, c - 1))
        if (c < this.size - 1) res.push(this.rcToIndex(r, c + 1))
        return res
    }

    canMove(tileIndex: number, tiles: Tiles): boolean {
        const blank = tiles.indexOf(0)
        const [r1, c1] = this.indexToRC(tileIndex)
        const [r2, c2] = this.indexToRC(blank)
        const dr = Math.abs(r1 - r2)
        const dc = Math.abs(c1 - c2)
        return dr + dc === 1
    }

    applyMove(tileIndex: number, tiles: Tiles): Tiles {
        const blank = tiles.indexOf(0)
        if (!this.canMove(tileIndex, tiles)) return tiles
        const next = tiles.slice()
        next[blank] = tiles[tileIndex]
        next[tileIndex] = 0
        return next
    }

    randomWalkScramble(steps = 100): Tiles {
        // 从已解状态出发执行合法随机移动，保证可解
        let tiles = this.createSolved()
        for (let i = 0; i < steps; i++) {
            const neighbors = this.neighborsOfBlank(tiles)
            const pick = neighbors[Math.floor(Math.random() * neighbors.length)]
            tiles = this.applyMove(pick, tiles)
        }
        // 避免直接返回已解（极小概率）：若已解，额外一次随机合法移动
        if (this.isSolved(tiles)) {
            const neighbors = this.neighborsOfBlank(tiles)
            const pick = neighbors[Math.floor(Math.random() * neighbors.length)]
            tiles = this.applyMove(pick, tiles)
        }
        return tiles
    }
}