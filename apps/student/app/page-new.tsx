import Link from "next/link"
import { getFeaturedLessons, getPopularLessons, getNewLessons, categories } from "../lib/catalog"

export default function Page() {
  const featuredMath = getFeaturedLessons().filter(l => l.category !== '语文学习').slice(0, 6)
  const popularLessons = getPopularLessons(4)
  const newLessons = getNewLessons(4)

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>一起用图解和动画学习</h1>
        <p>拖一拖、摆一摆、动手参与，快乐掌握数学与语文。</p>
      </section>

      {/* 年级入口 */}
      <section style={{ marginTop: 40, marginBottom: 40 }}>
        <h3 style={{ marginBottom: 16, textAlign: 'center' }}>📚 选择你的年级</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[1, 2, 3, 4, 5, 6].map(grade => (
            <Link
              key={grade}
              href={`/grade/${grade}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {grade === 1 || grade === 2 ? '🌱' : grade === 3 || grade === 4 ? '🌿' : '🌳'}
              </div>
              <div>{grade}年级</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 快速入口 */}
      <section style={{ marginTop: 40, marginBottom: 40 }}>
        <h3 style={{ marginBottom: 16, textAlign: 'center' }}>🚀 快速入口</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <Link href="/math" className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔢</div>
            <h3 className="card-title">数学乐园</h3>
            <p className="card-desc">按分类浏览所有数学课程</p>
          </Link>
          <Link href="/chinese" className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📚</div>
            <h3 className="card-title">语文天地</h3>
            <p className="card-desc">汉字、词汇、阅读理解</p>
          </Link>
          <Link href="/methods" className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎯</div>
            <h3 className="card-title">方法馆</h3>
            <p className="card-desc">按解题方法学习</p>
          </Link>
          <Link href="/lessons/ai-generator" className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🤖</div>
            <h3 className="card-title">AI出题</h3>
            <p className="card-desc">智能生成练习题</p>
          </Link>
        </div>
      </section>

      {/* 精选课程 */}
      <h3 style={{ marginTop: 40, marginBottom: 16 }}>⭐ 精选课程</h3>
      <section className="grid">
        {featuredMath.map(lesson => (
          <article key={lesson.href} className="card">
            <Link href={lesson.href}>
              {lesson.icon && <img src={lesson.icon} alt={lesson.title} />}
              <h3 className="card-title">{lesson.title}</h3>
              <p className="card-desc">{lesson.desc}</p>
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                fontSize: '12px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {'⭐'.repeat(lesson.difficulty)}
                </span>
                <span style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {lesson.gradeLevel === 'all' ? '全年级' : `${lesson.gradeLevel}年级`}
                </span>
                {lesson.duration && (
                  <span style={{
                    background: '#e0e7ff',
                    color: '#4338ca',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    ⏱ {lesson.duration}分钟
                  </span>
                )}
              </div>
            </Link>
          </article>
        ))}
      </section>

      {/* 热门课程 */}
      {popularLessons.length > 0 && (
        <>
          <h3 style={{ marginTop: 40, marginBottom: 16 }}>🔥 热门课程</h3>
          <section className="grid">
            {popularLessons.map(lesson => (
              <article key={lesson.href} className="card">
                <Link href={lesson.href}>
                  {lesson.icon && <img src={lesson.icon} alt={lesson.title} />}
                  <h3 className="card-title">{lesson.title}</h3>
                  <p className="card-desc">{lesson.desc}</p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px',
                    fontSize: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {'⭐'.repeat(lesson.difficulty)}
                    </span>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {lesson.gradeLevel === 'all' ? '全年级' : `${lesson.gradeLevel}年级`}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        </>
      )}

      {/* 新上线 */}
      {newLessons.length > 0 && (
        <>
          <h3 style={{ marginTop: 40, marginBottom: 16 }}>✨ 新上线</h3>
          <section className="grid">
            {newLessons.map(lesson => (
              <article key={lesson.href} className="card">
                <Link href={lesson.href}>
                  {lesson.icon && <img src={lesson.icon} alt={lesson.title} />}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#10b981',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    NEW
                  </div>
                  <h3 className="card-title">{lesson.title}</h3>
                  <p className="card-desc">{lesson.desc}</p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px',
                    fontSize: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {'⭐'.repeat(lesson.difficulty)}
                    </span>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {lesson.gradeLevel === 'all' ? '全年级' : `${lesson.gradeLevel}年级`}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        </>
      )}

      {/* 按学科浏览 */}
      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <h3 style={{ marginBottom: 24 }}>📖 按分类浏览</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          maxWidth: '900px',
          margin: '0 auto 40px'
        }}>
          {categories.filter(cat => cat.id !== '语文学习').map(cat => (
            <Link
              key={cat.id}
              href={`/category/${encodeURIComponent(cat.id)}`}
              style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#111827',
                border: '2px solid #e5e7eb',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#667eea'
                e.currentTarget.style.background = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.background = '#f9fafb'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
