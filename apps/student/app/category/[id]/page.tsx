import Link from "next/link"
import { getLessonsByCategory, categories, CategoryType } from "../../../lib/catalog"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = decodeURIComponent(params.id) as CategoryType

  const category = categories.find(c => c.id === categoryId)

  if (!category) {
    return (
      <div>
        <h2>分类不存在</h2>
        <Link href="/">返回首页</Link>
      </div>
    )
  }

  const allLessons = getLessonsByCategory(categoryId)

  // 按年级分组
  const lessonsByGrade: Record<number, typeof allLessons> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
  }

  allLessons.forEach(lesson => {
    if (lesson.gradeLevel === 'all') {
      // 全年级的课程添加到所有年级
      Object.keys(lessonsByGrade).forEach(grade => {
        lessonsByGrade[Number(grade)].push(lesson)
      })
    } else {
      lessonsByGrade[lesson.gradeLevel].push(lesson)
    }
  })

  return (
    <div>
      {/* 页头 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        borderRadius: '16px',
        color: 'white',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{category.icon}</div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>{category.name}</h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          {category.description} · 共 {allLessons.length} 门课程
        </p>
      </div>

      {/* 按年级展示 */}
      {[1, 2, 3, 4, 5, 6].map(grade => {
        const gradeLessons = lessonsByGrade[grade]
        if (gradeLessons.length === 0) return null

        const gradeInfo = {
          1: { icon: '🌱', name: '一年级', color: '#10b981' },
          2: { icon: '🌱', name: '二年级', color: '#34d399' },
          3: { icon: '🌿', name: '三年级', color: '#3b82f6' },
          4: { icon: '🌿', name: '四年级', color: '#60a5fa' },
          5: { icon: '🌳', name: '五年级', color: '#8b5cf6' },
          6: { icon: '🌳', name: '六年级', color: '#a78bfa' }
        }[grade]

        return (
          <div key={grade} style={{ marginBottom: '40px' }}>
            <h3 style={{
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: '#f9fafb',
              borderRadius: '8px',
              borderLeft: `4px solid ${gradeInfo?.color}`
            }}>
              <span style={{ fontSize: '24px' }}>{gradeInfo?.icon}</span>
              {gradeInfo?.name}
              <span style={{
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#6b7280',
                marginLeft: '8px'
              }}>
                ({gradeLessons.length}个课程)
              </span>
              <Link
                href={`/grade/${grade}`}
                style={{
                  marginLeft: 'auto',
                  fontSize: '14px',
                  color: '#667eea',
                  textDecoration: 'none'
                }}
              >
                查看{gradeInfo?.name}全部 →
              </Link>
            </h3>

            <section className="grid">
              {gradeLessons.map(lesson => (
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
          查看所有分类
        </Link>
      </div>
    </div>
  )
}

// 生成静态路径
export async function generateStaticParams() {
  return categories.map(cat => ({
    id: encodeURIComponent(cat.id)
  }))
}
