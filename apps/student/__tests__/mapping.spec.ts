import { describe, it, expect } from "vitest"
import { mapRatioState, mapJourneyState } from "../lib/mapping"

describe("mapping", () => {
  it("ratio", () => {
    const s = mapRatioState({ base: 5, ratio: 2 })
    expect(s.includes("B是A的2.00倍")).toBe(true)
  })
  it("journey meet", () => {
    const s = mapJourneyState({ a: { x: 0, v: 2 }, b: { x: 10, v: -1 } })
    expect(s.includes("相遇时间")).toBe(true)
  })
})