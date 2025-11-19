## 目标
- 让孩子在“看得见”的逐步动画中理解竖式的进位/借位与分数的通分/约分。
- 保持现有架构（StepPlayer、LessonRunner、MicroQuiz、VariantPanel），以可控步骤和朗读讲解驱动学习。

## 竖式进/借位动画（VerticalAddSubAnimated）
- 新组件：`components/VerticalAddSubAnimated.tsx`
- 动画步骤（StepPlayer联动）：
  1) 对齐位：高亮个位/十位/百位列，显示对齐线
  2) 个位计算：逐位加/减，出现“进位/借位”标记（小上标/斜线改写）
  3) 进位/借位传播：将进位加到下一列或从下一列借1十（改写成10）
  4) 十位/百位重复：同样逐位处理与标记
  5) 收尾：画横线，填最终结果，口述总结
- 交互细节：
  - Carry/Borrow模型：按位数组，记录每列`carry`与`borrow`，可回放
  - 高亮机制：当前列用颜色框/背景；进位用上标标记，借位在原位数字加斜线并在下一位显示改写数
  - 时间线：不引入新库，使用`requestAnimationFrame` + `setTimeout`协调；StepPlayer的“下一步/上一步/朗读”控制
- 页面：`/lessons/vertical-animated`
  - 输入a/b与运算（+/-），StepPlayer驱动；MicroQuiz考察“这一列进位是多少”“借位后该列数字是多少”
  - 变式：按难度生成（有无进/借位的组合）

## 分数通分LCM动画（FractionLCMAnimated）
- 新组件：`components/FractionLCMAnimated.tsx`
- 动画步骤：
  1) 显示两条分数条/圆，分母切割，分子着色
  2) 求LCM：在侧边显示分母分解（简单列出），计算LCM
  3) 细分到LCM：动画将两分数条细分为LCM份，并重新着色等值分数
  4) 通分加/减：合并或对齐叠加，显示总着色份数
  5) 约分：展示最大公因数，动画折叠减少份数，得到最简分数
- 交互细节：
  - 图形：优先SVG条形；每一步分割和着色以过渡方式呈现（渐变/宽度插值）
  - 数据：`lcm(a,b)`、`gcd(n,d)`，记录每一步的等值变化
  - StepPlayer控制与朗读；变式按难度生成（同分母/异分母、是否可约）
- 页面：`/lessons/fraction-add`
  - 输入两个分数（分子/分母）与运算（+/−），一步步通分与约分；MicroQuiz考“LCM是多少”“等值分数是多少”“最简结果是多少”

## 课堂语言与微指导
- 新增微指导：
  - `carry_explain`：进位出现在这一列的和≥10，向高一位加1十
  - `borrow_explain`：借位时从高一位借1十，当前位加10再减
  - `lcm_explain`：用两个分母的最小公倍数细分，分数大小不变
  - `gcd_explain`：约分等于分子分母同时除以最大公因数

## 接口与集成
- LessonRunner接入页面，复用现有`VariantPanel/MicroQuiz`生成变式与随机小测
- 不额外引入第三方动画库；后续若需要更顺滑再评估引入Motion/GSAP

## 验证
- 单元：carry/borrow计算、lcm/gcd函数正确性
- 集成：步骤同步，StepPlayer与动画状态一致
- 微测：≥80%正确率进掌握；错因触发微指导与变式

## 交付
- 新组件与两新页面；首页添加入口卡片；MicroQuiz与微指导更新
- 下一步可继续：小数对齐加减、百分↔分数互转练习、坐标/量角器更复杂演示