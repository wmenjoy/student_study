export type GridSize = { rows: number; cols: number }
export type Board = {
  rows: number
  cols: number
  mineCount: number
  mines: Uint8Array
  numbers: Uint8Array
  revealed: Uint8Array
  flagged: Uint8Array
  exploded: boolean
}

export class MinesEngine {
  rows: number
  cols: number
  mineCount: number

  constructor(rows: number, cols: number, mineCount: number) {
    this.rows = rows
    this.cols = cols
    this.mineCount = mineCount
  }

  size(): number { return this.rows * this.cols }
  rc(i: number): [number, number] { return [Math.floor(i / this.cols), i % this.cols] }
  idx(r: number, c: number): number { return r * this.cols + c }

  neighbors8(i: number): number[] {
    const [r, c] = this.rc(i)
    const res: number[] = []
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) res.push(this.idx(nr, nc))
      }
    }
    return res
  }

  createEmpty(): Board {
    const n = this.size()
    return {
      rows: this.rows,
      cols: this.cols,
      mineCount: this.mineCount,
      mines: new Uint8Array(n),
      numbers: new Uint8Array(n),
      revealed: new Uint8Array(n),
      flagged: new Uint8Array(n),
      exploded: false,
    }
  }

  plantMines(board: Board, excludeIndex: number): Board {
    const n = this.size()
    const mines = new Uint8Array(board.mines)
    let placed = 0
    while (placed < this.mineCount) {
      const pick = Math.floor(Math.random() * n)
      if (pick === excludeIndex) continue
      if (mines[pick]) continue
      mines[pick] = 1
      placed++
    }
    const numbers = this.computeNumbers(mines)
    return { ...board, mines, numbers }
  }

  computeNumbers(mines: Uint8Array): Uint8Array {
    const n = this.size()
    const numbers = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      if (mines[i]) { numbers[i] = 9; continue }
      let cnt = 0
      const ns = this.neighbors8(i)
      for (let k = 0; k < ns.length; k++) if (mines[ns[k]]) cnt++
      numbers[i] = cnt
    }
    return numbers
  }

  toggleFlag(board: Board, i: number): Board {
    if (board.revealed[i]) return board
    const flagged = new Uint8Array(board.flagged)
    flagged[i] = flagged[i] ? 0 : 1
    return { ...board, flagged }
  }

  reveal(board: Board, i: number): Board {
    if (board.revealed[i] || board.flagged[i]) return board
    if (board.mines[i]) {
      const revealed = new Uint8Array(board.revealed)
      revealed[i] = 1
      return { ...board, revealed, exploded: true }
    }
    const revealed = new Uint8Array(board.revealed)
    const queue = [i]
    while (queue.length) {
      const cur = queue.shift() as number
      if (revealed[cur]) continue
      revealed[cur] = 1
      if (board.numbers[cur] === 0) {
        const ns = this.neighbors8(cur)
        for (let k = 0; k < ns.length; k++) {
          const ni = ns[k]
          if (!revealed[ni] && !board.flagged[ni]) queue.push(ni)
        }
      }
    }
    return { ...board, revealed }
  }

  chordReveal(board: Board, i: number): Board {
    if (!board.revealed[i]) return board
    const need = board.numbers[i]
    if (need <= 0 || need >= 9) return board
    const ns = this.neighbors8(i)
    let flags = 0
    for (let k = 0; k < ns.length; k++) if (board.flagged[ns[k]]) flags++
    if (flags !== need) return board
    let next = board
    for (let k = 0; k < ns.length; k++) {
      const ni = ns[k]
      if (!next.flagged[ni] && !next.revealed[ni]) {
        next = this.reveal(next, ni)
        if (next.exploded) return next
      }
    }
    return next
  }

  isWin(board: Board): boolean {
    const n = this.size()
    for (let i = 0; i < n; i++) {
      if (!board.mines[i] && !board.revealed[i]) return false
    }
    return !board.exploded
  }

  solve(board: Board): Board {
    const revealed = new Uint8Array(board.revealed)
    const flagged = new Uint8Array(board.flagged)
    for (let i = 0; i < revealed.length; i++) {
      revealed[i] = board.mines[i] ? 0 : 1
      flagged[i] = board.mines[i] ? 1 : 0
    }
    return { ...board, revealed, flagged, exploded: false }
  }
}