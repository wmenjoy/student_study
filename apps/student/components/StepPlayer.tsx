"use client"
import { useEffect, useState, useRef } from "react"

type Props = { steps: string[]; title?: string; index?: number; onIndexChange?: (i: number) => void; durations?: number[]; auto?: boolean }

export function StepPlayer({ steps, title, index, onIndexChange, durations, auto }: Props) {
  const [localIdx, setLocalIdx] = useState(0)
  const [playing, setPlaying] = useState(Boolean(auto))
  const idx = index ?? localIdx
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const setIdxNumber = (i: number) => {
    if (onIndexChange) onIndexChange(i)
    else setLocalIdx(i)
  }

  const speak = (msg: string) => {
    if (typeof window === "undefined") return
    const s = new SpeechSynthesisUtterance(msg)
    s.lang = "zh-CN"
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(s)
  }

  useEffect(() => {
    if (steps[idx]) speak(steps[idx])
  }, [idx])

  const next = () => {
    const ni = Math.min(steps.length - 1, idx + 1)
    setIdxNumber(ni)
  }

  const prev = () => {
    const pi = Math.max(0, idx - 1)
    setIdxNumber(pi)
  }

  const replay = () => speak(steps[idx] || "")

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    const delay = durations?.[idx] ?? 2000
    timerRef.current = setTimeout(() => {
      if (idx < steps.length - 1) {
        next()
      } else {
        setPlaying(false)
      }
    }, delay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx, durations])

  const progress = ((idx + 1) / steps.length) * 100

  return (
    <div className="intro-block">
      {title && <div className="intro-title">{title}</div>}

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div style={{ marginBottom: 16, minHeight: 48, fontSize: 16, lineHeight: 1.6 }}>
        {steps[idx] || ""}
      </div>

      <div className="step-controls">
        <button className="btn-circle" onClick={prev} disabled={idx === 0} aria-label="上一步">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>

        <button className={`btn-circle ${playing ? 'primary' : ''}`} onClick={() => setPlaying(p => !p)} aria-label={playing ? "暂停" : "播放"}>
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          )}
        </button>

        <button className="btn-circle" onClick={replay} aria-label="重读">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
        </button>

        <button className="btn-circle" onClick={next} disabled={idx === steps.length - 1} aria-label="下一步">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
        步骤 {idx + 1} / {steps.length}
      </div>
    </div>
  )
}