"use client"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light")
  useEffect(() => {
    const t = localStorage.getItem("theme") || "light"
    setTheme(t)
    document.documentElement.setAttribute("data-theme", t)
  }, [])
  const toggle = () => {
    const t = theme === "light" ? "dark" : "light"
    setTheme(t)
    localStorage.setItem("theme", t)
    document.documentElement.setAttribute("data-theme", t)
  }
  return (
    <button className="btn ghost" onClick={toggle}>{theme === "light" ? "浅色" : "深色"}</button>
  )
}