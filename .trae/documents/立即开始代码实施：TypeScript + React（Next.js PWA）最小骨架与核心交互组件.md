## 目标
- 在当前目录创建可运行的学生端应用（Next.js + TypeScript），实现三个核心交互：比例条、数轴、行程仿真；包含图→式映射与最小数据持久化。

## 将创建的结构
- `apps/student`：Next.js PWA（App Router）
- `apps/student/app/page.tsx`：首页与导航
- `apps/student/app/lessons/ratio/page.tsx`：比例条交互页
- `apps/student/app/lessons/journey/page.tsx`：行程相遇仿真页
- `apps/student/app/lessons/number-line/page.tsx`：数轴交互页
- `apps/student/components/RatioBar.tsx`、`NumberLine.tsx`、`JourneySim.tsx`
- `apps/student/lib/mapping.ts`：图→式映射函数
- `apps/student/lib/lessonMachine.ts`：关卡状态机（XState）
- `apps/student/lib/db.ts`：Dexie表结构（`profiles/skills/progress`）
- `apps/student/public/sw.js`：简易Service Worker（离线）
- 基础配置：`package.json`、`tsconfig.json`、`next.config.js`、`eslint`、`vitest.config.ts`
- 测试：`apps/student/__tests__/mapping.spec.ts`

## 关键实现要点
- 比例条：SVG拖拽标注两量、差值与倍数，输出算式与口语解释
- 数轴：刻度与标记拖拽，支持步长与区间
- 行程仿真：两点速度与起点可配置，动画模拟相遇/追及，输出相遇时刻
- 图→式映射：统一从交互状态生成表达；错误触发等价提示占位
- 状态机：`Intro → Build → Map → MicroTest → Review` 基骨架
- Dexie：保存进度与掌握度占位字段
- PWA：缓存首页与三页、静态资源

## 验收
- 首页能进入三页并完成基本交互
- 映射返回正确算式与口语解释（示例题面）
- 简易离线可用（缓存关键路由）
- 单元测试通过（映射函数）

## 后续扩展（本次不阻塞）
- 词语小游戏与笔画演示组件加入
- 家长端与Authoring Studio在下一Sprint创建