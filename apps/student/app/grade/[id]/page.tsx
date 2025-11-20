import Link from "next/link"
import { getLessonsByGrade, getGradeStats, categories, CategoryType } from "../../../lib/catalog"

interface GradePageProps {
  params: {
    id: string
  }
}

export default function GradePage({ params }: GradePageProps) {
  const gradeNum = parseInt(params.id) as 1 | 2 | 3 | 4 | 5 | 6

  if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 6) {
    return (
      <div>
        <h2>年级不存在</h2>
        <p>请选择1-6年级</p>
        <Link href="/">返回首页</Link>
      </div>
    )
  }

  const lessons = getLessonsByGrade(gradeNum)
  const stats = getGradeStats(gradeNum)

  // 按分类分组
  const lessonsByCategory: Record<CategoryType, typeof lessons> = {
    '数与运算': [],
    '计算工具': [],
    '图形测量': [],
    '应用题': [],
    '思维训练': [],
    'AI助手': [],
    '语文学习': []
  }

  lessons.forEach(lesson => {
    if (lessonsByCategory[lesson.category]) {
      lessonsByCategory[lesson.category].push(lesson)
    }
  })

  // 年级图标和描述
  const gradeInfo = {
    1: { icon: '🌱', name: '一年级', desc: '低年级', color: '#10b981' },
    2: { icon: '🌱', name: '二年级', desc: '低年级', color: '#34d399' },
    3: { icon: '🌿', name: '三年级', desc: '中年级', color: '#3b82f6' },
    4: { icon: '🌿', name: '四年级', desc: '中年级', color: '#60a5fa' },
    5: { icon: '🌳', name: '五年级', desc: '高年级', color: '#8b5cf6' },
    6: { icon: '🌳', name: '六年级', desc: '高年级', color: '#a78bfa' }
  }

  const info = gradeInfo[gradeNum]

  return (
    <div>
      {/* 页头 */}
      <div style={{
        background: `linear-gradient(135deg, ${info.color} 0%, ${info.color}dd 100%)`,
        padding: '40px 20px',
        borderRadius: '16px',
        color: 'white',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{info.icon}</div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>{info.name}数学</h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          {info.desc} · 共 {stats.total} 门课程
        </p>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: '#fef3c7',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400e' }}>
            {stats.byDifficulty.easy}
          </div>
          <div style={{ fontSize: '12px', color: '#78350f' }}>简单</div>
        </div>
        <div style={{
          background: '#fed7aa',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐⭐</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9a3412' }}>
            {stats.byDifficulty.medium}
          </div>
          <div style={{ fontSize: '12px', color: '#7c2d12' }}>中等</div>
        </div>
        <div style={{
          background: '#fecaca',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐⭐⭐</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#991b1b' }}>
            {stats.byDifficulty.hard}
          </div>
          <div style={{ fontSize: '12px', color: '#7f1d1d' }}>困难</div>
        </div>
        {stats.byDifficulty.challenge > 0 && (
          <div style={{
            background: '#e9d5ff',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭐⭐⭐⭐</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b21a8' }}>
              {stats.byDifficulty.challenge}
            </div>
            <div style={{ fontSize: '12px', color: '#581c87' }}>挑战</div>
          </div>
        )}
      </div>

      {/* 按分类展示课程 */}
      {categories
        .filter(cat => cat.id !== '语文学习')
        .map(category => {
          const categoryLessons = lessonsByCategory[category.id]
          if (categoryLessons.length === 0) return null

          return (
            <div key={category.id} style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{category.icon}</span>
                {category.name}
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'normal',
                  color: '#6b7280',
                  marginLeft: '8px'
                }}>
                  ({categoryLessons.length}个课程)
                </span>
              </h3>

              <section className="grid">
                {categoryLessons.map(lesson => (
                  <article key={lesson.href} className="card" style={{ position: 'relative' }}>
                    <Link href={lesson.href}>
                      {lesson.icon && <img src={lesson.icon} alt={lesson.title} />}

                      {/* 标签 */}
                      {(lesson.new || lesson.popular || lesson.featured) && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          display: 'flex',
                          gap: '4px',
                          flexDirection: 'column',
                          alignItems: 'flex-end'
                        }}>
                          {lesson.new && (
                            <span style={{
                              background: '#10b981',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              NEW
                            </span>
                          )}
                          {lesson.popular && (
                            <span style={{
                              background: '#f59e0b',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              🔥 热门
                            </span>
                          )}
                          {lesson.featured && (
                            <span style={{
                              background: '#8b5cf6',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              ⭐ 精选
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="card-title">{lesson.title}</h3>
                      <p className="card-desc">{lesson.desc}</p>

                      {/* 元数据 */}
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
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {'⭐'.repeat(lesson.difficulty)}
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
                        {lesson.subCategory && (
                          <span style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {lesson.subCategory}
                          </span>
                        )}
                      </div>

                      {/* 前置课程提示 */}
                      {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                        <div style={{
                          marginTop: '8px',
                          fontSize: '11px',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span>🔒</span>
                          <span>需要先学习前置课程</span>
                        </div>
                      )}
                    </Link>
                  </article>
                ))}
              </section>
            </div>
          )
        })}

      {/* 返回导航 */}
      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <Link href="/" className="btn ghost">
          ← 返回首页
        </Link>
        <Link href="/math" className="btn ghost" style={{ marginLeft: '16px' }}>
          查看所有数学课程
        </Link>
      </div>
    </div>
  )
}

// 生成静态路径
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' }
  ]
}
