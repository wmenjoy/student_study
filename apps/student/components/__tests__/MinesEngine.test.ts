import { describe, it, expect } from "vitest"
import { MinesEngine, Board } from "../../components/MinesEngine"

describe("MinesEngine", () => {
  it("first reveal is safe", () => {
    const eng = new MinesEngine(9, 9, 10)
    const empty = eng.createEmpty()
    const planted = eng.plantMines(empty, 0)
    expect(planted.mines[0]).toBe(0)
  })

  it("zero flood expands", () => {
    const eng = new MinesEngine(3, 3, 0)
    const b = eng.createEmpty()
    const r = eng.reveal({ ...b, numbers: new Uint8Array(9) }, 4)
    const opened = Array.from(r.revealed).reduce((a, b) => a + b, 0)
    expect(opened).toBe(9)
  })

  it("win when all non-mines opened", () => {
    const eng = new MinesEngine(2, 2, 1)
    const b = eng.createEmpty()
    const minesArray = new Uint8Array([1,0,0,0])
    const planted = { ...b, mines: minesArray, numbers: eng.computeNumbers(minesArray) }
    let r: Board = planted
    r = eng.reveal(r, 1)
    r = eng.reveal(r, 2)
    r = eng.reveal(r, 3)
    expect(eng.isWin(r)).toBe(true)
  })
})