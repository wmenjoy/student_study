import Link from "next/link"
import { categories, allLessons } from "../../lib/catalog"

export default function MathLandingPage() {
  const mathCategories = categories.filter(cat => cat.id !== '语文学习')

  return (
    <div>
      <h2>数学乐园 🔢</h2>
      <p className="hint">探索数学的奥秘，从基础到进阶，寓教于乐。</p>

      {/* 快速入口 */}
      <section style={{ marginTop: 32, marginBottom: 40 }}>
        <h3 style={{ marginBottom: 16 }}>🚀 快速入口</h3>
        <div className="grid">
          {[1, 2, 3, 4, 5, 6].map(grade => (
            <article key={grade} className="card">
              <Link href={`/grade/${grade}`} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  {grade === 1 || grade === 2 ? '🌱' : grade === 3 || grade === 4 ? '🌿' : '🌳'}
                </div>
                <h3 className="card-title">{grade}年级</h3>
                <p className="card-desc">
                  查看{grade}年级所有课程
                </p>
              </Link>
            </article>
          ))}

          <article className="card">
            <Link href="/methods" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
              <h3 className="card-title">方法馆</h3>
              <p className="card-desc">
                按解题方法分类
              </p>
            </Link>
          </article>

          <article className="card">
            <Link href="/lessons/ai-generator" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
              <h3 className="card-title">AI出题</h3>
              <p className="card-desc">
                智能生成练习题
              </p>
            </Link>
          </article>
        </div>
      </section>

      {/* 按分类浏览 */}
      <h3 style={{ marginTop: 40, marginBottom: 16 }}>📚 按分类浏览</h3>
      <section className="grid">
        {mathCategories.map(category => {
          const categoryLessons = allLessons.filter(l => l.category === category.id)

          return (
            <article key={category.id} className="card">
              <Link href={`/category/${encodeURIComponent(category.id)}`}>
                <div style={{ fontSize: '48px', marginBottom: '12px', textAlign: 'center' }}>
                  {category.icon}
                </div>
                <h3 className="card-title">{category.name}</h3>
                <p className="card-desc">{category.description}</p>
                <div style={{
                  marginTop: '12px',
                  fontSize: '14px',
                  color: '#6b7280',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{categoryLessons.length}个课程</span>
                  <span style={{ color: '#667eea' }}>查看 →</span>
                </div>
              </Link>
            </article>
          )
        })}
      </section>

      {/* 学段说明 */}
      <div style={{
        marginTop: 60,
        padding: '32px',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        borderRadius: '16px',
        border: '2px solid #e5e7eb'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: 20, textAlign: 'center' }}>
          📖 学段划分说明
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱 低年级</div>
            <h4 style={{ margin: '8px 0', color: '#10b981' }}>1-2年级</h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              基础认知阶段，通过具体操作和图形辅助理解数学概念。重点掌握数的认识、简单运算和基础应用题。
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌿 中年级</div>
            <h4 style={{ margin: '8px 0', color: '#3b82f6' }}>3-4年级</h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              进阶发展阶段，开始接触乘除法、分数、图形面积等概念。应用题逐渐复杂，培养分析和推理能力。
            </p>
          </div>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌳 高年级</div>
            <h4 style={{ margin: '8px 0', color: '#8b5cf6' }}>5-6年级</h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              综合提升阶段，掌握比例、百分数、方程等高级概念。应用题需要多步骤推理，为初中数学打基础。
            </p>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link className="btn ghost" href="/">
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
