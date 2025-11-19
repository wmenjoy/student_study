"use client"
import { useEffect, useState } from "react"

type Props = {
    total: number
    current: number
    status?: "idle" | "correct" | "wrong"
    currentQuestion?: string
    onAnswerSubmit?: (answer: string) => void
    showVictory?: boolean
}

type Obstacle = {
    id: number
    position: number
    type: "question" | "bonus" | "checkpoint"
    cleared: boolean
}

export function MathClimbingGame({
    total,
    current,
    status = "idle",
    currentQuestion = "",
    onAnswerSubmit,
    showVictory = false
}: Props) {
    const [answer, setAnswer] = useState("")
    const [coins, setCoins] = useState(0)
    const [showQuestionModal, setShowQuestionModal] = useState(false)
    const [obstacles, setObstacles] = useState<Obstacle[]>([])
    const [characterAnimation, setCharacterAnimation] = useState<"idle" | "jump" | "celebrate">("idle")

    // Initialize obstacles
    useEffect(() => {
        const newObstacles: Obstacle[] = []
        for (let i = 1; i <= total; i++) {
            newObstacles.push({
                id: i,
                position: i,
                type: i % 5 === 0 ? "checkpoint" : i % 3 === 0 ? "bonus" : "question",
                cleared: i <= current
            })
        }
        setObstacles(newObstacles)
    }, [total, current])

    // Handle status changes
    useEffect(() => {
        if (status === "correct") {
            setCharacterAnimation("jump")
            setCoins(c => c + 10)
            setTimeout(() => setCharacterAnimation("idle"), 600)
        } else if (status === "wrong") {
            setCharacterAnimation("idle")
        }
    }, [status])

    // Show victory animation
    useEffect(() => {
        if (showVictory) {
            setCharacterAnimation("celebrate")
        }
    }, [showVictory])

    const handleSubmit = () => {
        if (answer.trim() && onAnswerSubmit) {
            onAnswerSubmit(answer.trim())
            setAnswer("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit()
        }
    }

    // Calculate character position
    const progress = Math.min(current / total, 1)
    const characterY = 80 - (progress * 60) // Move from bottom to top

    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "600px",
            background: "linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #90EE90 100%)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}>
            {/* Background decorations */}
            <div style={{
                position: "absolute",
                top: "10px",
                right: "20px",
                fontSize: "32px"
            }}>☀️</div>

            <div style={{
                position: "absolute",
                top: "40px",
                left: "30px",
                fontSize: "24px"
            }}>☁️</div>

            <div style={{
                position: "absolute",
                top: "80px",
                right: "60px",
                fontSize: "20px"
            }}>☁️</div>

            {/* Mountain/Climbing Path */}
            <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Mountain path */}
                <path
                    d="M 100 550 Q 200 450, 300 400 Q 400 350, 500 300 Q 600 250, 700 150"
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="40"
                    strokeLinecap="round"
                    opacity="0.3"
                />

                {/* Obstacles/Platforms */}
                {obstacles.map((obstacle, idx) => {
                    const pathProgress = obstacle.position / total
                    const x = 100 + pathProgress * 600
                    const y = 550 - pathProgress * 400

                    let emoji = "❓"
                    let color = "#FFD700"

                    if (obstacle.type === "checkpoint") {
                        emoji = "🚩"
                        color = "#FF6B6B"
                    } else if (obstacle.type === "bonus") {
                        emoji = "⭐"
                        color = "#FFA500"
                    }

                    return (
                        <g key={obstacle.id}>
                            {/* Platform */}
                            <rect
                                x={x - 30}
                                y={y - 10}
                                width="60"
                                height="20"
                                rx="10"
                                fill={obstacle.cleared ? "#4CAF50" : color}
                                opacity={obstacle.cleared ? 0.6 : 0.9}
                                stroke="#fff"
                                strokeWidth="2"
                            />

                            {/* Obstacle icon */}
                            <text
                                x={x}
                                y={y + 5}
                                fontSize="24"
                                textAnchor="middle"
                                style={{
                                    filter: obstacle.cleared ? "grayscale(100%)" : "none",
                                    opacity: obstacle.cleared ? 0.5 : 1
                                }}
                            >
                                {obstacle.cleared ? "✓" : emoji}
                            </text>

                            {/* Step number */}
                            <text
                                x={x}
                                y={y + 35}
                                fontSize="12"
                                textAnchor="middle"
                                fill="#333"
                                fontWeight="bold"
                            >
                                {obstacle.position}
                            </text>
                        </g>
                    )
                })}

                {/* Character */}
                <g
                    style={{
                        transform: `translate(${100 + progress * 600}px, ${550 - progress * 400}px)`,
                        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    }}
                >
                    {/* Character shadow */}
                    <ellipse
                        cx="0"
                        cy="20"
                        rx="20"
                        ry="8"
                        fill="rgba(0,0,0,0.2)"
                    />

                    {/* Character body */}
                    <g style={{
                        transform: characterAnimation === "jump" ? "translateY(-20px)" :
                            characterAnimation === "celebrate" ? "scale(1.2)" : "none",
                        transition: "transform 0.3s ease"
                    }}>
                        <text
                            x="0"
                            y="0"
                            fontSize="48"
                            textAnchor="middle"
                            style={{
                                filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))"
                            }}
                        >
                            🦸
                        </text>
                    </g>

                    {/* Status indicator */}
                    {status === "correct" && (
                        <text
                            x="0"
                            y="-40"
                            fontSize="24"
                            textAnchor="middle"
                            fill="#4CAF50"
                            fontWeight="bold"
                            style={{
                                animation: "fadeOut 0.6s ease-out"
                            }}
                        >
                            +10 ✨
                        </text>
                    )}

                    {status === "wrong" && (
                        <text
                            x="0"
                            y="-40"
                            fontSize="24"
                            textAnchor="middle"
                            fill="#f44336"
                            fontWeight="bold"
                            style={{
                                animation: "shake 0.4s ease"
                            }}
                        >
                            ❌
                        </text>
                    )}
                </g>

                {/* Victory flag at top */}
                <g transform="translate(700, 150)">
                    <line x1="0" y1="0" x2="0" y2="-60" stroke="#8B4513" strokeWidth="4" />
                    <path
                        d="M 0 -60 L 40 -50 L 0 -40 Z"
                        fill="#FF6B6B"
                        style={{
                            animation: showVictory ? "wave 0.5s ease infinite" : "none"
                        }}
                    />
                </g>
            </svg>

            {/* Game UI Overlay */}
            <div style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                background: "rgba(255,255,255,0.9)",
                padding: "12px 20px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                display: "flex",
                gap: "20px",
                alignItems: "center"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🏆</span>
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>{current}/{total}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "24px" }}>🪙</span>
                    <span style={{ fontWeight: "bold", fontSize: "18px", color: "#FFD700" }}>{coins}</span>
                </div>
            </div>

            {/* Question Panel */}
            <div style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.95)",
                padding: "24px 32px",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                minWidth: "400px",
                maxWidth: "600px",
                border: status === "correct" ? "3px solid #4CAF50" :
                    status === "wrong" ? "3px solid #f44336" : "3px solid #2196F3"
            }}>
                <div style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                    color: "#333",
                    textAlign: "center"
                }}>
                    {currentQuestion || "准备开始冒险！"}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入答案（数字或分数如1/2）"
                        disabled={showVictory}
                        style={{
                            flex: 1,
                            padding: "12px 16px",
                            fontSize: "16px",
                            border: "2px solid #ddd",
                            borderRadius: "8px",
                            outline: "none",
                            transition: "border-color 0.3s"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#2196F3"}
                        onBlur={(e) => e.target.style.borderColor = "#ddd"}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!answer.trim() || showVictory}
                        style={{
                            padding: "12px 32px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: answer.trim() && !showVictory ? "pointer" : "not-allowed",
                            opacity: answer.trim() && !showVictory ? 1 : 0.5,
                            transition: "all 0.3s",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                        }}
                        onMouseEnter={(e) => {
                            if (answer.trim() && !showVictory) {
                                e.currentTarget.style.transform = "translateY(-2px)"
                                e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.6)"
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)"
                        }}
                    >
                        提交答案
                    </button>
                </div>
            </div>

            {/* Victory Screen */}
            {showVictory && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "fadeIn 0.5s ease"
                }}>
                    <div style={{
                        background: "white",
                        padding: "48px",
                        borderRadius: "24px",
                        textAlign: "center",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    }}>
                        <div style={{ fontSize: "72px", marginBottom: "24px" }}>🎉</div>
                        <h2 style={{ fontSize: "36px", marginBottom: "16px", color: "#333" }}>恭喜通关！</h2>
                        <p style={{ fontSize: "20px", color: "#666", marginBottom: "24px" }}>
                            你成功完成了所有挑战！
                        </p>
                        <div style={{
                            display: "flex",
                            gap: "24px",
                            justifyContent: "center",
                            fontSize: "18px",
                            marginTop: "32px"
                        }}>
                            <div>
                                <div style={{ fontSize: "32px" }}>🏆</div>
                                <div style={{ fontWeight: "bold", color: "#FFD700" }}>{total}题</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "32px" }}>🪙</div>
                                <div style={{ fontWeight: "bold", color: "#FFD700" }}>{coins}金币</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    )
}
