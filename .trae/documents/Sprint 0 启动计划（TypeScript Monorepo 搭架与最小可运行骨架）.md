## 目标与范围
- 目标：建立可运行的跨端Monorepo骨架与最小学习关卡，确保离线、测试、可及性与质量门槛齐备。
- 范围：apps（student/authoring/guardian）与packages（ui/interactive-templates/simulation-engine/adaptive/content-dsl/data）的基础结构与依赖、CI、示例关卡与验证。

## 技术与依赖
- 核心：TypeScript 5、React 18、Next.js（App Router + PWA）
- 状态/数据：Zustand、Dexie（IndexedDB）、Workbox（Service Worker）
- 交互/动画：SVG + Konva（Canvas）、D3、Framer Motion/GSAP
- 状态机：XState（关卡流转）
- 测试：Vitest、Playwright、axe-core（可及性）
- 规范：ESLint、Prettier、Tailwind + CSS变量（色盲友好主题）
- Monorepo：pnpm + Turborepo

## 目录与包结构
- apps/
  - student（Next.js PWA）：关卡运行时、TTS、离线与示例关卡
  - authoring（Next.js）：内容制作与校验预览
  - guardian（Next.js）：家长/老师端报表
- packages/
  - ui：基础UI与主题（按钮、面板、图形容器）
  - interactive-templates：比例条、数轴、笔画演示骨架
  - simulation-engine：行程相遇/追及模型与动画绑定
  - adaptive：掌握度API（BKT/ELO），动态出题与错因接口
  - content-dsl：题型JSON/DSL Schema、Ajv校验、图→式映射器
  - data：Dexie实体（profiles/skills/progress/artifacts/contentCache/events）、离线同步与埋点

## 关键接口与骨架
- Template<TParams, TResult>：统一模板协议（校验、序列化、回放）
- SimulationModel：step/reset/observe，与模板状态双向绑定
- MappingService：交互状态→口语解释与算式/方程
- AdaptiveAPI：updateSkill/nextExercise
- Dexie 表与仓储：profiles/skills/progress/artifacts/contentCache/events
- XState 关卡机：Intro → Build → Map → Practice → MicroTest → Review

## 开发任务清单（Sprint 0，1周）
- Monorepo 初始化：pnpm workspace、Turborepo pipeline、统一 tsconfig/eslint/prettier
- apps/student：Next.js 基础路由、PWA 与 Workbox、TTS 封装、示例关卡路由
- packages/ui：主题与组件基线，色盲友好主题与字体可调
- packages/content-dsl：DSL Schema（meta/prompt/assets/templateId/params/constraints/hints/misconceptions/variants/evaluation）、Ajv 校验器初版
- packages/interactive-templates：比例条与数轴最小组件（拖拽、吸附、标注）
- packages/simulation-engine：行程模型（相遇/追及）与视图绑定骨架
- packages/data：Dexie 实体与仓储封装、基础埋点接口
- apps/authoring：原型（题面录入、校验与预览）
- CI：lint/test/build pipeline；Playwright 基础脚手架；axe 栈接入

## 示例关卡（最小可用）
- 数学：行程相遇示例（两点速度与起点设置→动画→图→式映射→微测）
- 数学：比例条示例（两个量的倍数/差值标注→算式生成）
- 语文：笔画演示示例（笔顺动画→轨迹采集与评分原型）

## 验证计划（Sprint 0）
- 单元：
  - 比例条/数轴逻辑（拖拽/吸附/标注），覆盖率≥70%（首版门槛）
  - 行程仿真数值正确性（相遇时刻、追及条件）与动画绑定
  - DSL Schema 校验器（边界值与单位一致性）
- 集成：
  - 关卡状态机完整流转（Intro→Review）
  - 图→式映射输出一致性（首版正确率≥90%）
- E2E：
  - 示例关卡路径（进入/操作/映射/微测）
  - 离线模式加载与操作可用
- 可及性与性能：
  - axe 扫描通过关键页面；TTS 覆盖示例题干
  - 首屏离线加载<2s、交互延迟<100ms（示例场景）

## 验收标准（Go/No-Go）
- 构建与CI通过；示例关卡可完整运行且离线可用
- 模板交互稳定（无明显抖动与错位）；仿真数值与动画一致
- 映射正确率≥90%，可回退口语提示；可及性扫描无高危问题

## 后续节奏（Sprint 1–2 预告）
- Sprint 1：完善模板与仿真、Authoring 可用预览、映射正确率提升到≥95%
- Sprint 2：专题闭环（差倍/行程）、笔画纠错与词语小游戏、家长端简版、自适应基础版

## 需要确认
- 是否采用 Next.js + Turborepo + pnpm 的组合作为首选？
- Windows 环境下是否需要本地 SQLite 替代 IndexedDB（如桌面端准备）？
- TTS 使用 Web Speech API，是否需要备用方案（如本地音频包）？