# 课程分类系统重构 - 迁移指南

## 📝 概述

已创建新的课程分类系统，解决了原有系统的混乱和重复问题。新系统基于教育学原理和用户体验优化，提供清晰的年级、分类、难度体系。

## 🎯 核心改进

### 1. 统一的分类体系
- **年级分类**：1-6年级完整覆盖
- **知识分类**：数与运算、计算工具、图形测量、应用题、思维训练、AI助手、语文学习
- **难度标记**：⭐(简单) ⭐⭐(中等) ⭐⭐⭐(困难) ⭐⭐⭐⭐(挑战)
- **学习元数据**：时长、前置课程、标签等

### 2. 消除内容重复
- 每个课程只定义一次
- 通过筛选函数动态生成不同视图
- 支持多标签灵活分类

### 3. 清晰的学习路径
- 按年级浏览
- 按分类浏览
- 按方法浏览
- 前置课程关系

## 📁 新文件结构

```
apps/student/
├── lib/
│   ├── catalog.ts          # 旧文件（待废弃）
│   └── catalog-new.ts      # ✨ 新分类系统
├── app/
│   ├── page.tsx                    # 旧首页
│   ├── page-new.tsx                # ✨ 新首页
│   ├── math/page.tsx               # 旧数学页
│   ├── math-new/page.tsx           # ✨ 新数学页
│   ├── grade/[id]/page.tsx         # ✨ 新年级页面
│   └── category/[id]/page.tsx      # ✨ 新分类页面
└── docs/
    ├── navigation-analysis.md      # 详细分析文档
    ├── grade-question-mapping.md   # 年级题型映射
    └── migration-guide.md          # 本文档
```

## 🔄 迁移步骤

### 阶段一：测试新系统（推荐先做）

1. **访问新页面进行测试**
   ```
   新首页：app/page-new.tsx
   新数学页：app/math-new/page.tsx
   年级页：app/grade/[id]/page.tsx
   分类页：app/category/[id]/page.tsx
   ```

2. **测试所有功能**
   - 年级筛选是否正确
   - 分类是否合理
   - 难度标记是否准确
   - 链接是否有效

### 阶段二：正式启用（测试无误后）

1. **备份旧文件**
   ```bash
   mv app/page.tsx app/page-old.tsx
   mv app/math/page.tsx app/math/page-old.tsx
   mv lib/catalog.ts lib/catalog-old.ts
   ```

2. **启用新文件**
   ```bash
   mv app/page-new.tsx app/page.tsx
   mv app/math-new/page.tsx app/math/page.tsx
   mv lib/catalog-new.ts lib/catalog.ts
   ```

3. **更新导入语句**
   - 检查所有文件中的 `import` 语句
   - 确保导入路径正确

### 阶段三：清理旧代码

1. **删除废弃文件**
   ```bash
   rm app/page-old.tsx
   rm app/math/page-old.tsx
   rm lib/catalog-old.ts
   ```

2. **删除 grade2 目录**
   ```bash
   rm -rf app/grade2
   ```
   （已被 `/grade/[id]` 替代）

## 📊 数据结构对比

### 旧结构
```typescript
// 简单的数组，无元数据
export const homeMath = [
  { href: "/lessons/ratio", title: "比例条", desc: "...", icon: "..." },
  // ...
]
```

### 新结构
```typescript
// 丰富的元数据
export const allLessons: LessonItem[] = [
  {
    href: "/lessons/ratio",
    title: "比例条",
    desc: "倍数与差值",
    icon: "/icons/ratio.svg",

    // 核心分类
    gradeLevel: 5,
    difficulty: 3,
    category: '数与运算',
    subCategory: '比与比例',

    // 学习元数据
    duration: 20,
    prerequisites: [],
    tags: ['可视化', '重要'],

    // 展示标记
    featured: false,
    popular: false,
    new: false
  }
]
```

## 🛠️ 辅助函数使用

### 按年级筛选
```typescript
import { getLessonsByGrade } from '../lib/catalog-new'

const grade3Lessons = getLessonsByGrade(3)
```

### 按分类筛选
```typescript
import { getLessonsByCategory } from '../lib/catalog-new'

const applicationProblems = getLessonsByCategory('应用题')
const grade3Applications = getLessonsByCategory('应用题', 3)
```

### 获取精选课程
```typescript
import { getFeaturedLessons } from '../lib/catalog-new'

const allFeatured = getFeaturedLessons()
const grade4Featured = getFeaturedLessons(4)
```

### 搜索课程
```typescript
import { searchLessons } from '../lib/catalog-new'

const results = searchLessons('行程')
```

### 获取统计信息
```typescript
import { getGradeStats } from '../lib/catalog-new'

const stats = getGradeStats(3)
// {
//   total: 28,
//   byCategory: { '数与运算': 8, '应用题': 12, ... },
//   byDifficulty: { easy: 5, medium: 15, hard: 8, challenge: 0 },
//   featured: 3
// }
```

## 🎨 UI组件示例

### 课程卡片（带完整元数据）
```tsx
<article className="card" style={{ position: 'relative' }}>
  <Link href={lesson.href}>
    {lesson.icon && <img src={lesson.icon} alt={lesson.title} />}

    {/* 标签 */}
    {lesson.new && <span className="badge new">NEW</span>}
    {lesson.popular && <span className="badge popular">🔥 热门</span>}
    {lesson.featured && <span className="badge featured">⭐ 精选</span>}

    <h3>{lesson.title}</h3>
    <p>{lesson.desc}</p>

    {/* 元数据 */}
    <div className="metadata">
      <span className="difficulty">{'⭐'.repeat(lesson.difficulty)}</span>
      <span className="grade">{lesson.gradeLevel}年级</span>
      <span className="duration">⏱ {lesson.duration}分钟</span>
    </div>
  </Link>
</article>
```

## 📋 检查清单

启用新系统前，请确认：

- [ ] 所有55个课程都已添加到 `allLessons` 数组
- [ ] 每个课程的元数据（年级、难度、分类）都准确
- [ ] 测试了所有年级页面（1-6年级）
- [ ] 测试了所有分类页面
- [ ] 验证了精选、热门、新课程标记
- [ ] 检查了前置课程关系是否合理
- [ ] 所有链接都能正常工作
- [ ] UI在移动端和桌面端都显示正常

## 🚀 下一步优化

1. **学习进度追踪**
   - localStorage 保存学习记录
   - 显示完成百分比
   - 前置课程锁定

2. **个性化推荐**
   - 基于年级
   - 基于学习进度
   - 基于薄弱环节

3. **搜索和筛选**
   - 全局搜索框
   - 多维度筛选
   - 排序选项

4. **学习路径图**
   - 可视化课程关系
   - 技能树展示
   - 推荐学习顺序

## 📞 问题反馈

如果发现任何问题，请记录：
1. 问题描述
2. 复现步骤
3. 期望行为
4. 实际行为
5. 截图（如有）

## 📚 相关文档

- `docs/navigation-analysis.md` - 详细的分析和设计方案
- `docs/grade-question-mapping.md` - AI出题的年级题型映射
- `lib/catalog-new.ts` - 新分类系统源代码

---

**重要提示**：建议先在开发环境充分测试后再部署到生产环境！
