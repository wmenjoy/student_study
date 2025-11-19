import { describe, it, expect } from "vitest"
import { grade2Topics } from "./catalog"

describe("grade2Topics", () => {
  it("is defined and non-empty", () => {
    expect(Array.isArray(grade2Topics)).toBe(true)
    expect(grade2Topics.length).toBeGreaterThan(0)
    expect(grade2Topics[0]).toHaveProperty("href")
  })
})