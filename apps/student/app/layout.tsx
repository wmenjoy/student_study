import type { ReactNode } from "react"
import "./globals.css"
import { ThemeToggle } from "../components/ThemeToggle"
import { MainNav } from "../components/MainNav"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5C9DFF" />
        <title>学习乐园</title>
      </head>
      <body className="app-root">
        <header className="app-header">
          <div className="container header-bar">
            <div className="brand">学习乐园</div>
            <MainNav />
            <ThemeToggle />
          </div>
        </header>
        <main className="container">
          {children}
        </main>
        <footer className="app-footer">
          <div className="container">一起快乐学习 · 动手实践 · 图解思维</div>
        </footer>
      </body>
    </html>
  )
}