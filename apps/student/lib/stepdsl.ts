export type StepScript = { labels: string[]; narration: string[]; hints: { build: string[]; map: string[]; microtest?: string[]; review?: string[] }; durations?: number[]; events?: string[] }

export const verticalScript: StepScript = {
  labels: ["对齐位", "计算个位", "计算十位", "计算百位", "读出结果"],
  narration: [
    "把两个数按位对齐，准备逐列计算。",
    "先算个位，可能产生进位或需要借位。",
    "再算十位，注意来自个位的进位/借位。",
    "然后算百位，继续按顺序。",
    "读出完整结果。"
  ],
  hints: {
    build: ["输入两数与加减", "按步骤逐列计算"],
    map: ["观察当前列的进/借位箭头", "读出中途和/差"],
    microtest: ["判断该列是否进/借位", "给出该列的结果"],
    review: ["换一组数再练习", "总结位值与信息流"]
  },
  durations: [1200, 1400, 1400, 1400, 1200]
  ,events: ["align", "carry_or_borrow", "carry_or_borrow", "carry_or_borrow", "read_result"]
}

export const fractionScript: StepScript = {
  labels: ["展示原分数", "质因数展开", "LCM逐因子合并", "细分到LCM并等值", "通分加/减", "约分得到最简"],
  narration: [
    "先看两个分数的原始样子。",
    "把分母做质因数分解，找出构成。",
    "逐个因子合并得到最小公倍数。",
    "细分到LCM并得到等值分数。",
    "在同分母下进行加/减。",
    "约分到最简形式。"
  ],
  hints: {
    build: ["输入两分数与运算", "按步骤完成通分与加减"],
    map: ["观察LCM因子如何合并", "关注等值分数的变化"],
    microtest: ["给出LCM数值", "写出通分后的加/减式"],
    review: ["更换分数再练习", "总结LCM/GCD的联系"]
  },
  durations: [1200, 1500, 1600, 1400, 1400, 1200]
  ,events: ["show", "factorize", "merge_factors", "refine_to_lcm", "sum_or_diff", "reduce_simplify"]
}

export const seriesScript: StepScript = {
  labels: ["展示数列", "配对可视化", "确定每对与对数", "计算总和"],
  narration: [
    "这是一个等差数列，尝试观察首尾关系。",
    "把首尾配对，每对的和相同。",
    "确认每对的和与对数，若项数为奇数有一个中项。",
    "用配对法或平均法计算总和。"
  ],
  hints: {
    build: ["输入起点、终点与步长"],
    map: ["把首尾配成对，观察每对的和"],
    microtest: ["计算某个数列的和", "写出配对表达式"],
    review: ["尝试不同范围与步长", "总结配对法与平均法关系"]
  },
  durations: [1200, 1400, 1400, 1400],
  events: ["show", "pair", "confirm_pair", "sum"]
}

export const assumeScript: StepScript = {
  labels: ["题面", "全鸡假设", "多余腿数", "读出鸡兔"],
  narration: [
    "已知头与腿，总数固定。",
    "先假设都是鸡，计算腿数。",
    "用实际腿数减去假设腿数得到多余腿。",
    "多余腿每2条对应1只兔，求出兔与鸡。"
  ],
  hints: {
    build: ["输入头与腿"],
    map: ["先做全鸡假设，再计算多余腿"],
    microtest: ["检查假设腿数", "检查多余腿数"],
    review: ["更换数据再练习", "总结假设与修正思想"]
  },
  durations: [1200, 1400, 1400, 1400],
  events: ["show", "assume", "extra", "result"]
}

export const groupScript: StepScript = {
  labels: ["展示数列", "绘制配对", "高亮配对", "统计对数"],
  narration: [
    "给定数列与目标和。",
    "把首尾或合适的两个数连接成和为目标的配对。",
    "高亮所有配对，确保覆盖正确。",
    "统计对数并用于求和。"
  ],
  hints: {
    build: ["输入数列与目标和"],
    map: ["尝试首尾配对"],
    microtest: ["给出配对或对数"],
    review: ["总结配对规律"]
  },
  durations: [1200, 1400, 1400, 1400],
  events: ["show", "pair", "confirm", "count"]
}

export const figureScript: StepScript = {
  labels: ["展示网格", "填充图形", "每行计数", "总数"],
  narration: [
    "这是一个网格图形。",
    "填充部分格子表示需统计的图形。",
    "按行计数更快，得到每行数量。",
    "汇总得到总数。"
  ],
  hints: { build: ["设置行列与填充"], map: ["逐行统计"], microtest: ["给出总数或每行数"], review: ["更换参数再练习"] },
  durations: [1200, 1400, 1400, 1400],
  events: ["show", "fill", "row_count", "total"]
}

export const ticketScript: StepScript = {
  labels: ["题面", "列方程", "求解"],
  narration: [
    "已知票价、张数与总收入。",
    "列出成人与儿童票的方程。",
    "求出成人与儿童票数量。"
  ],
  hints: { build: ["输入价格、张数与收入"], map: ["写出两元一次方程"], microtest: ["给出成人或儿童票数量"], review: ["更换数据再练习"] },
  durations: [1200, 1400, 1400],
  events: ["show", "equation", "solve"]
}

export const ageScript: StepScript = {
  labels: ["题面", "求当前年龄", "几年后年龄"],
  narration: [
    "给定两人的年龄和与差。",
    "用和差公式求出当前年龄。",
    "推算若干年后的年龄。"
  ],
  hints: { build: ["输入和、差与几年后"], map: ["应用 (和±差)/2"], microtest: ["给出A或B年龄"], review: ["更换数据再练习"] },
  durations: [1200, 1400, 1400],
  events: ["show", "solve", "future"]
}

export const riverScript: StepScript = {
  labels: ["题面", "上下行时间", "时间差"],
  narration: [
    "给定船速、水速与距离。",
    "计算上行 L/(v−c) 与下行 L/(v+c) 的时间。",
    "得到时间差并解读。"
  ],
  hints: { build: ["输入船速、水速与距离"], map: ["推导上/下行公式"], microtest: ["给出时间或差值"], review: ["更换参数再练习"] },
  durations: [1200, 1400, 1400],
  events: ["show", "compute", "diff"]
}

export const defectScript: StepScript = {
  labels: ["题面", "第一次称(3v3)", "第二次称(1v1)", "读出次品"],
  narration: [
    "有8瓶，其中1瓶更轻。",
    "先将1-3与4-6对称，观察轻的一侧或平衡。",
    "在可疑组中任选两瓶对称，若平衡则第三瓶为次品。",
    "确定次品位置。"
  ],
  hints: { build: ["设置次品位置"], map: ["先3v3再1v1"], microtest: ["给出最少称次"], review: ["总结三态信息量与分组策略"] },
  durations: [1200, 1400, 1400, 1200],
  events: ["show", "weigh1", "weigh2", "result"]
}