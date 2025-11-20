import { describe, it, expect } from "vitest"
import { FifteenEngine } from "../../components/FifteenEngine"

describe("FifteenEngine", () => {
  it("solved board is detected", () => {
    const engine = new FifteenEngine(4)
    const solved = engine.createSolved()
    expect(engine.isSolved(solved)).toBe(true)
  })

  it("random walk scramble is solvable", () => {
    const engine = new FifteenEngine(4)
    const t = engine.randomWalkScramble(200)
    expect(engine.isSolvable(t)).toBe(true)
    expect(engine.isSolved(t)).toBe(false)
  })

  it("adjacent tile can move into blank", () => {
    const engine = new FifteenEngine(3)
    // Construct a simple board where blank at center
    const tiles = [1,2,3,4,0,5,6,7,8]
    const indexOf5 = tiles.indexOf(5)
    expect(engine.canMove(indexOf5, tiles)).toBe(true)
    const next = engine.applyMove(indexOf5, tiles)
    expect(next.indexOf(0)).toBe(indexOf5)
  })
})