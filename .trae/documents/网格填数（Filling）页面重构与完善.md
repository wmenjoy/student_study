## 问题诊断
- 现有页面使用大量渐变与装饰性样式，信息层级不清晰，交互与规则提示分散，整体观感杂乱。
- 交互模型基于“涂色选区”，与标准 Filling 的“在每格输入数字”玩法不一致，导致认知负担与规则表达偏差。
- 规则校验不完整：只在完成后检查连通与格数匹配，未强制“相同数字区域不接触（含对角）”。
- 撤销/重做与历史栈耦合在绘制函数内，易产生状态错乱；完成弹层中调用未定义函数 `goToNextLevel`（apps/student/components/GridFillingGame.tsx:460-467）。
- 页面未复用项目通用壳（LessonShell），与站点视觉规范不一致（apps/student/app/lessons/grid-filling/page.tsx:24）。

## 外部实现要点（参考）
- 站点加载的资源：`vue.min.js`、`element-ui.min.js`、`element-ui.en.js`、`httpVueLoader.js`、`css/element-ui.min.css`、`css/index.css`、`css/puzzle.css`、`scripts/puzzles/puzzle-filling.js`、`scripts/puzzles/filling.wasm`、以及分析脚本（Clarity）。
- 探测到 `scripts/puzzles/filling.wasm` 为核心引擎，`puzzle-filling.js` 负责页面挂载与逻辑绑定；玩法为键入数字、拖拽多选、Backspace 清除，规则：
  - 每个数字 n 的正交连通区域面积恰为 n。
  - 相同数字的区域互不接触（包括拐角）。
  - 网格完全填满。

## 目标与原则（第一性）
- 以“规则清晰可见、交互直接、反馈及时”为核心：数字即规则，规则即验证，验证即视觉反馈。
- 简化视觉，统一壳层与控件布局；去除过度装饰，突出棋盘与状态。
- 交互与规则完全对齐 Filling：选格→键入数字→多选批量→一键清除→实时校验。

## 重构设计
- 结构拆分：
  - `FillingBoard`（棋盘，单元格渲染与选区管理）
  - `FillingControls`（类型/难度、新局、重开、撤销/重做、解答）
  - `FillingStatusBar`（用时、错误计数、完成提示）
  - `FillingEngine`（纯 TS 规则/校验/分区构造，不依赖外部 WASM）
- 状态模型：
  - `Cell { value?: number; fixed?: boolean }[][]`（固定提示不可改动）
  - `selection: Set<key>`（键盘输入覆盖选区）
  - 历史：`past[] / present / future[]`（撤销/重做解耦渲染）
  - 计时：开始/暂停/完成结算
- 交互：
  - 鼠标与触控统一（拖拽多选、`touch-action: none`），键盘 1-9 与 Backspace；移动端提供数字小键盘。
  - 初始提示格可点击高亮其目标约束，便于认知。

## 规则校验与反馈
- 连通性：对每个值 v 的所有同值格，用 BFS/DFS 分割连通分量，分量面积必须恰等于 v。
- 接触约束：
  - 正交邻接：不同连通分量的同值格不得相邻。
  - 角接触：对角同值格也判为非法（扫描四对角）。
- 完整性：不存在空格；若不满足，定位并高亮冲突格/边，侧栏显示错误计数与类型。
- 实时提示：超填/欠填、连通性断裂、同值接触，分别以边框/背景/徽标指示。

## 视觉与布局
- 用 `LessonShell` 包裹页面，统一标题与返回（apps/student/components/LessonShell.tsx）。
- 控件栏：左侧“类型/大小选择 + 计时”，右侧“撤销/重做、重开、新局、解答”。
- 棋盘：CSS Grid 等宽格；自适应大小并提供缩放；固定提示格以粗体显示。
- 颜色与层级：中性色面板、清晰边界，突出数字而非渐变；仅在需要时使用动画。

## 兼容外部引擎（可选）
- 若需引入生成器：后续评估将 `filling.wasm` 替换为开源实现（如 Simon Tatham 的 Filling 引擎），通过轻量适配层对接 TS 模型。
- 当前迭代不引入 WASM，优先完成纯前端规则与体验一致性。

## 代码改动概览
- `apps/student/app/lessons/grid-filling/page.tsx`：
  - 替换为 `LessonShell`，移除彩色渐变，统一壳层与标题。
- `apps/student/components/GridFillingGame.tsx`：
  - 由“涂色索引”改为“数字棋盘”模型；拆分子组件与引擎；
  - 增加键入数字、多选、Backspace 清除；
  - 实时规则校验（连通/面积/接触含对角）与错误高亮；
  - 修复 `goToNextLevel` 未定义；重构撤销/重做为时间旅行栈。

## 验证与测试
- 单元测试：
  - 分区构造与面积校验
  - 同值接触检测（正交/对角）
  - 完整性与完成判断
- 手测脚本：不同网格尺寸与预置关卡；移动端触控与桌面键盘。
- 视觉回归：在 `http://localhost:3000/lessons/grid-filling` 打开，检查信息层级与交互流程；确保帧率与响应性。

## 交付与后续
- 首次迭代完成后再评估外部生成器/WASM 接入与“Game ID/Random Seed/存档”支持。
- 如需保留“涂色玩法”，将其作为教学模式的可选视图，与标准 Filling 数字模式并行。