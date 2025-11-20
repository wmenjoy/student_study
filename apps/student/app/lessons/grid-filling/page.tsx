import { LessonShell } from "../../../components/LessonShell"
import { GridFillingGame } from "../../../components/GridFillingGame"

export default function Page() {
    return (
        <LessonShell title="方格谜题 - 数字填充">
            <GridFillingGame />
        </LessonShell>
    )
}