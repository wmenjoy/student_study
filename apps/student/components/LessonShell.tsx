import Link from "next/link"
import { ReactNode } from "react"

type Props = {
    title: string
    backUrl?: string
    children: ReactNode
    action?: ReactNode
}

export function LessonShell({ title, backUrl = "/", children, action }: Props) {
    return (
        <div className="lesson-shell">
            <header className="lesson-header">
                <div className="lesson-header-left">
                    <Link href={backUrl} className="btn-icon-back" aria-label="返回">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="lesson-title">{title}</h1>
                </div>
                {action && <div className="lesson-header-right">{action}</div>}
            </header>
            <main className="lesson-content">
                {children}
            </main>
        </div>
    )
}
