## 技术落地路线
- 技术栈：TypeScript 5、React 18、Next.js（App Router + PWA）、Zustand、Dexie、Workbox、XState、Konva/SVG、D3、Vitest、Playwright、ESLint/Prettier。
- 架构：Monorepo（pnpm + Turborepo），apps（student/authoring/guardian）+ packages（ui/interactive-templates/simulation-engine/adaptive/content-dsl/data）。

## Monorepo目录结构
- /apps/student：学习端PWA（关卡运行时、模板装配、TTS与可及性）。
- /apps/authoring：Authoring Studio（题面编辑、脚本与校验、素材管理）。
- /apps/guardian：家长/老师端（技能雷达、错因摘要、周报）。
- /packages/ui：UI组件与主题（色盲友好、字体可调）。
- /packages/interactive-templates：比例条、数轴、面积模型、天平、树形概率、维恩图、图形拼板、方程搭建器、笔画、词语、阅读标注。
- /packages/simulation-engine：行程/工程/浓度/盈亏/概率/几何仿真，Model↔View双向绑定。
- /packages/adaptive：掌握度（BKT/ELO）、动态出题、错因诊断与微指导。
- /packages/content-dsl：题型JSON/DSL Schema、校验器、图→式映射器。
- /packages/data：Dexie表结构、同步与冲突解决、埋点上报。

## 核心接口（示意）
- Template<TParams, TResult>：统一模板协议（入参/结果/校验/序列化）。
- SimulationModel：step(dt)/reset()、状态可观察；与模板参数双向绑定。
- MappingService：fromInteractiveState→{speech, expression}
- AdaptiveAPI：updateSkill(skillId, evidence)、nextExercise(skillId)
- Dexie表：profiles、skills、progress、artifacts、contentCache、events。

## 内容DSL要点
- 字段：meta（年级/教材/技能节点）、prompt、assets、templateId、params、constraints、hints、misconceptions、variants、evaluation。
- 规则：单位一致性、边界值、映射正确性、错因脚本绑定、版本与本地化。

## 关卡状态机（XState）
- 节点：Intro → Build(操作) → Map(图→式) → Practice(变式) → MicroTest → Review。
- 事件：操作完成/错误触发/提示请求/微测通过/未达标补练。

## 验证计划（按包）
- interactive-templates：逻辑单元测试覆盖≥80%，拖拽/吸附/标注一致性。
- simulation-engine：数值与动画一致性（行程/工程/浓度/盈亏/概率），边界与浮点稳定。
- content-dsl：Schema校验、约束与映射正确率≥95%。
- adaptive：掌握度更新回归、动态出题策略、≥3类错因识别准确率≥70%。
- apps：E2E核心路径（跨设备与离线），作品保存与复盘、家长报表。
- 可及性与性能：axe-core检查、TTS覆盖100%、交互延迟<100ms、离线加载<2s。

## Sprint 0（W0–1）目标与交付
- 目标：可运行骨架与最低限度依赖。
- 任务：
  - Monorepo初始化、CI（lint/test/build）与质量门槛。
  - 设计系统与主题v1（色盲友好、字号尺度）。
  - DSL Schema与校验器v1；Dexie表结构与数据字典。
  - 学习端基础路由与PWA；关卡状态机骨架。
- 验收：
  - 构建与测试全部通过；示例关卡能加载与流转；离线基本可用。

## Sprint 1（W1–2）目标与交付
- 目标：交互模板与仿真最小可用版本。
- 任务：
  - 模板v1：比例条、数轴、笔画演示（轨迹采集与评分原型）。
  - 仿真v1：行程相遇/追及；Model↔View绑定。
  - 图→式映射服务v1（口语与算式生成）。
  - Authoring Studio原型：题面录入、校验与预览。
- 验收：
  - 模板交互稳定（吸附/标注）；行程仿真数值与动画一致；映射正确率≥90%。
  - E2E：示例关卡完整路径；离线场景可跑。

## Sprint 2（W3–4）目标与交付
- 目标：专题闭环与家长端简版。
- 任务：
  - 数学：差倍与行程的变式训练与微测闭环；错因脚本绑定。
  - 语文：笔画纠错与部件高亮、词语小游戏v1。
  - 家长端：技能雷达与错因摘要、周报v1。
  - 自适应：掌握度更新与动态出题基础版。
- 验收：
  - 专题掌握度阈值（0.8）触发与补练回路；错因识别≥3类准确率≥70%。
  - 家长端数据一致；E2E跨设备通过；性能与可及性门槛达标。

## 指标门槛（阶段性）
- 学习：映射正确率≥95%；微测通过率阈值逻辑稳定；掌握度≥0.8样本占比≥60%（Sprint2）。
- 参与：平均会话≥10分钟；作品保存≥1/周；离线可用率≥95%。
- 性能与稳定：交互延迟<100ms；离线加载<2s；崩溃率低于行业均值。
- 可及性：TTS覆盖、色盲主题与键盘/触控导航达标。

## 风险与对策
- 模板复杂度：优先SVG与简化交互，Konva仅用于高密度区域；严格性能预算。
- 映射鲁棒性：规则+示例驱动开发，覆盖边界与单位一致性；失败回退口语提示。
- 自适应偏差：先简化策略，A/B校准；透明化学习路径与可回溯。
- 离线包体积：分块与懒加载；素材压缩与差分更新。

## 下一步
- 按Sprint 0启动Monorepo与基础包；生成示例关卡与模板骨架；建立CI与验收门槛。