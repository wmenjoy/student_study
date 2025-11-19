"use client"
import { usePathname } from "next/navigation"
import { mainNav } from "../lib/nav"

export function MainNav() {
  const pathname = usePathname()
  return (
    <nav style={{ display: "flex", gap: 10 }}>
      {mainNav.map(item => (
        <a key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={pathname === item.href ? "active" : undefined}>{item.label}</a>
      ))}
    </nav>
  )
}