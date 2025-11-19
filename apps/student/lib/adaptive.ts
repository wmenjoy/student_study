import { db } from "./db"

export async function updateSkill(id: string, correct: boolean) {
  const now = Date.now()
  const cur = await db.skills.get(id)
  const lvl = cur ? cur.level : 1000
  const k = 32
  const target = correct ? 1 : 0
  const exp = 0.5
  const next = Math.round(lvl + k * (target - exp))
  await db.skills.put({ id, level: next, updatedAt: now })
  return next
}

export async function nextExercise(skillId: string) {
  const cur = await db.skills.get(skillId)
  const lvl = cur ? cur.level : 1000
  const difficulty = lvl < 980 ? "easy" : lvl > 1020 ? "hard" : "medium"
  return { skillId, difficulty }
}