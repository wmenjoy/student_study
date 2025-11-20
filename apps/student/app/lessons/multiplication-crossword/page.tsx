"use client"

import MultiplicationCrosswordGame from "../../../components/MultiplicationCrosswordGame"
import Link from "next/link"

export default function MultiplicationCrosswordPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            padding: '16px'
        }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}>
                            ← 返回首页
                        </button>
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#0f172a',
                        marginBottom: '8px'
                    }}>九九乘除法棋盘格</h1>
                    <p style={{ color: '#475569' }}>
                        填入数字和运算符号，完成所有的算式！
                    </p>
                </div>

                <MultiplicationCrosswordGame />
            </div>
        </div>
    )
}
