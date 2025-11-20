import { LessonShell } from "../../../components/LessonShell"
import { MinesGame } from "../../../components/MinesGame"

export default function Page() {
  return (
    <LessonShell title="扫雷 - Mines">
      <MinesGame />
    </LessonShell>
  )
}