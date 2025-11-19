import { createMachine } from "xstate"

export const lessonMachine = createMachine({
  id: "lesson",
  initial: "intro",
  states: {
    intro: { on: { NEXT: "build" } },
    build: { on: { NEXT: "map", BACK: "intro" } },
    map: { on: { NEXT: "microtest", BACK: "build" } },
    microtest: { on: { PASS: "review", FAIL: "practice", BACK: "map" } },
    practice: { on: { NEXT: "microtest", BACK: "map" } },
    review: { on: { RESTART: "intro" } }
  }
})