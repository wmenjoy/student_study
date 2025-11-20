## 目标
- 在学生应用中新增“Fifteen（15-滑块）”数字游戏：4×4 默认，支持 3×3～6×6 可自定义。
- 提供新建（随机局）、重启（回到当前局初始状态）、撤销/重做、步数计数与用时计时；完成后弹出明确提示并可再玩一次。
- 支持鼠标点击移动与键盘方向键操作；包含可解性检查，保证随机局可解。

## 参考现有模式
- 页面壳使用 `LessonShell`（apps/student/components/LessonShell.tsx:11），页面写法参考 `grid-filling`（apps/student/app/lessons/grid-filling/page.tsx:6）。
- 组件化结构与样式沿用 `GridFillingGame` 的组织方式（状态栏、棋盘、侧栏控制、完成弹层），以保持一致 UI/UX（apps/student/components/GridFillingGame.tsx:151、165、187）。

## 文件与路径
- 新增页面：`apps/student/app/lessons/fifteen/page.tsx`（使用 LessonShell + FifteenGame）。
- 新增组件：
  - `apps/student/components/FifteenGame.tsx`
  - `apps/student/components/FifteenEngine.ts`
  - `apps/student/components/FifteenBoard.tsx`
  - `apps/student/components/FifteenControls.tsx`
  - `apps/student/components/FifteenStatusBar.tsx`
  - `apps/student/components/Fifteen.css`

## 核心引擎（FifteenEngine.ts）
- 棋盘表示：长度为 `size*size` 的数组，`1..n-1` 为数字，`0` 表示空格。
- 可解性判断：
  - 宽度为奇数：逆序数为偶数即可解。
  - 宽度为偶数：从底部计数的空格行与逆序数奇偶组合满足经典规则（偶行+奇逆序 或 奇行+偶逆序）。
- 随机初始化：生成随机排列，若不可解则调整（交换两个非空数字或迭代生成直到可解），保证“新建局”必可解。
- 移动规则：仅允许与空格正交相邻的数字滑入空格；提供 `canMove(tileIndex, blankIndex)` 与 `applyMove`。
- 完成判断：数组与目标序列 `1..n-1,0` 完全一致。

## 组件结构
- FifteenGame：
  - 状态：`size`、`tiles`、`initialTiles`、`history`+`historyIndex`、`moveCount`、`seconds`、`isRunning`、`isSolved`。
  - 生命周期：选择尺寸或新建时生成可解初始局；重启回到 `initialTiles`；每步入栈并更新计数与完成判定。
  - 视图：状态栏（关卡/尺寸、计时、步数、完成徽标）、棋盘、侧栏控制、完成弹层（含“再玩一次”“新建随机局”）。
- FifteenBoard：
  - 使用 CSS Grid 渲染 `size×size`；每个 tile 为按钮。
  - 点击可移动的数字时触发交换；显示空格为占位（无文本）。
  - 键盘方向键：移动空格（或将相应方向的数字滑入空格），行为与常见实现一致。
- FifteenControls：
  - 尺寸选择（3×3～6×6）。
  - 按钮：`新建`（随机可解局）、`重启`、`撤销`、`重做`、可选 `解答`（直接置为目标序列用于教学演示）。
  - 展示：当前可解性状态（新建时保证可解，显示“可解”徽标）。
- FifteenStatusBar：
  - 字段：尺寸标签、计时器、步数、完成状态徽标；风格参考 `FillingStatusBar`（apps/student/components/FillingStatusBar.tsx:10）。

## 交互与控制
- 新建：生成不同随机初始局，写入 `initialTiles`、清零计时与步数、清空历史，开始计时。
- 重启：恢复到 `initialTiles`，清零计时与步数、重置历史。
- 撤销/重做：栈式管理，每次移动入栈；根据边界禁用按钮（参考 `FillingControls` 的 `canUndo/canRedo`，apps/student/components/FillingControls.tsx:45）。
- 键盘：`ArrowUp/Down/Left/Right` 移动；监听与清理事件在棋盘挂载/卸载时完成。

## 计时与统计
- 每秒计时（参考 GridFilling 计时实现，apps/student/components/GridFillingGame.tsx:90）；完成或暂停时停止计时。
- 步数计数：每次合法移动 +1；撤销/重做相应增减或保持原始统计（可配置为不计入撤销）。

## 完成提示
- 达成目标序列后：
  - 停止计时，弹出覆盖层与对话框（参考 GridFilling 的完成弹层，apps/student/components/GridFillingGame.tsx:187）。
  - 使用 `canvas-confetti` 增强庆祝效果（依赖已存在：apps/student/package.json:14）。
  - 提供“下一尺寸/再玩一次/新建随机局”操作。

## 样式
- 复用 `GridFilling.css` 的布局思想与按钮样式变量，新增 `Fifteen.css`：
  - `.fifteen-board`：网格容器、间距、圆角、触控友好。
  - `.tile` / `.tile-empty`：尺寸、字体、悬停态、可移动高亮（可选）。
  - 响应式：在移动端缩小 tile 尺寸（参考 GridFilling 媒体查询，apps/student/components/GridFilling.css:192）。

## 测试与验证
- 单元测试（Vitest）：
  - `isSolvable` 在奇/偶尺寸下的典型用例；
  - 已完成序列判定；
  - 相邻移动规则。
- 手动验证：
  - 新建局可移动与可解性；
  - 重启回到初始；
  - 撤销/重做正确；
  - 完成后显示提示并停止计时；
  - 键盘方向键可操作。

## 实施顺序
1) 搭引擎（可解性、移动、完成判定）。
2) 棋盘与交互（点击/键盘）。
3) 游戏壳（状态、计时、历史与控制）。
4) 完成弹层与庆祝效果。
5) 样式与响应式。
6) 测试用例与自测。