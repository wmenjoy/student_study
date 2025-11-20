// 新的课程分类系统
// 基于教育学原理和用户体验优化

// ==================== 类型定义 ====================

export interface LessonItem {
  href: string
  title: string
  desc: string
  icon: string

  // 核心分类字段
  gradeLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'all'  // 适合年级
  difficulty: 1 | 2 | 3 | 4  // 难度：1=简单 2=中等 3=困难 4=挑战
  category: CategoryType  // 主分类
  subCategory?: string  // 子分类

  // 学习元数据
  duration?: number  // 预计学习时长（分钟）
  prerequisites?: string[]  // 前置课程的 href
  tags: string[]  // 标签：游戏、动画、交互等

  // 展示标记
  featured?: boolean  // 是否精选
  new?: boolean  // 是否新课程
  popular?: boolean  // 是否热门
}

export type CategoryType =
  | '数与运算'
  | '计算工具'
  | '图形测量'
  | '应用题'
  | '思维训练'
  | 'AI助手'
  | '语文学习'

export interface Category {
  id: CategoryType
  name: string
  icon: string
  description: string
  order: number
  gradeLevels: number[]
}

// ==================== 分类体系定义 ====================

export const categories: Category[] = [
  {
    id: '数与运算',
    name: '数与运算',
    icon: '🔢',
    description: '数字认识、四则运算、分数小数',
    order: 1,
    gradeLevels: [1, 2, 3, 4, 5, 6]
  },
  {
    id: '计算工具',
    name: '计算工具',
    icon: '🛠️',
    description: '数轴、天平、量角器等辅助工具',
    order: 2,
    gradeLevels: [1, 2, 3, 4, 5, 6]
  },
  {
    id: '图形测量',
    name: '图形测量',
    icon: '📐',
    description: '面积、角度、比例尺',
    order: 3,
    gradeLevels: [1, 2, 3, 4, 5, 6]
  },
  {
    id: '应用题',
    name: '应用题',
    icon: '📝',
    description: '各类实际问题的数学建模',
    order: 4,
    gradeLevels: [1, 2, 3, 4, 5, 6]
  },
  {
    id: '思维训练',
    name: '思维训练',
    icon: '🧠',
    description: '逻辑推理、空间想象、趣味游戏',
    order: 5,
    gradeLevels: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 'AI助手',
    name: 'AI助手',
    icon: '🤖',
    description: 'AI智能出题和学习辅助',
    order: 6,
    gradeLevels: [1, 2, 3, 4, 5, 6]
  },
  {
    id: '语文学习',
    name: '语文学习',
    icon: '📚',
    description: '汉字、词汇、阅读',
    order: 7,
    gradeLevels: [1, 2, 3, 4, 5, 6]
  }
]

// ==================== 所有课程数据 ====================

export const allLessons: LessonItem[] = [

  // ==================== 数与运算 ====================
  {
    href: "/lessons/number-line",
    title: "数轴",
    desc: "刻度与区间",
    icon: "/icons/number-line.svg",
    gradeLevel: 1,
    difficulty: 1,
    category: '数与运算',
    subCategory: '数的认识',
    duration: 10,
    tags: ['基础', '交互', '可视化'],
    featured: true
  },
  {
    href: "/lessons/placevalue",
    title: "位值分解",
    desc: "百十个位分解",
    icon: "/icons/ratio.svg",
    gradeLevel: 1,
    difficulty: 1,
    category: '数与运算',
    subCategory: '数的认识',
    duration: 12,
    tags: ['基础', '动画'],
    featured: true
  },
  {
    href: "/lessons/vertical",
    title: "竖式计算",
    desc: "加减列竖式",
    icon: "/icons/number-line.svg",
    gradeLevel: 2,
    difficulty: 1,
    category: '数与运算',
    subCategory: '四则运算',
    duration: 15,
    prerequisites: ["/lessons/placevalue"],
    tags: ['基础', '交互']
  },
  {
    href: "/lessons/vertical-animated",
    title: "竖式进借位动画",
    desc: "逐列高亮与标记",
    icon: "/icons/number-line.svg",
    gradeLevel: 2,
    difficulty: 2,
    category: '数与运算',
    subCategory: '四则运算',
    duration: 15,
    prerequisites: ["/lessons/vertical"],
    tags: ['动画', '进阶'],
    popular: true
  },
  {
    href: "/lessons/area",
    title: "面积模型",
    desc: "乘法与面积",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '数与运算',
    subCategory: '乘法理解',
    duration: 20,
    tags: ['可视化', '重要'],
    featured: true
  },
  {
    href: "/lessons/percent",
    title: "百分网格",
    desc: "百分↔小数",
    icon: "/icons/area.svg",
    gradeLevel: 4,
    difficulty: 2,
    category: '数与运算',
    subCategory: '小数百分数',
    duration: 18,
    tags: ['可视化', '转换']
  },
  {
    href: "/lessons/fraction-add",
    title: "分数通分与约分",
    desc: "LCM通分,GCD约分",
    icon: "/icons/area.svg",
    gradeLevel: 4,
    difficulty: 3,
    category: '数与运算',
    subCategory: '分数运算',
    duration: 25,
    tags: ['重要', '算法'],
    popular: true
  },
  {
    href: "/lessons/ratio",
    title: "比例条",
    desc: "倍数与差值",
    icon: "/icons/ratio.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '数与运算',
    subCategory: '比与比例',
    duration: 20,
    tags: ['可视化', '重要']
  },

  // ==================== 计算工具 ====================
  {
    href: "/lessons/scale",
    title: "天平",
    desc: "平衡与等式",
    icon: "/icons/scale.svg",
    gradeLevel: 2,
    difficulty: 2,
    category: '计算工具',
    duration: 15,
    tags: ['交互', '可视化', '等式'],
    featured: true
  },
  {
    href: "/lessons/protractor",
    title: "量角器读数",
    desc: "角度与旋转",
    icon: "/icons/prob.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '计算工具',
    duration: 12,
    tags: ['交互', '测量']
  },
  {
    href: "/lessons/scale-ruler",
    title: "比例尺与尺子",
    desc: "图长→实长",
    icon: "/icons/scale.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '计算工具',
    duration: 18,
    tags: ['测量', '比例']
  },
  {
    href: "/lessons/cashier",
    title: "钱币与找零",
    desc: "凑整与找零",
    icon: "/icons/words.svg",
    gradeLevel: 2,
    difficulty: 1,
    category: '计算工具',
    duration: 15,
    tags: ['生活应用', '交互'],
    popular: true
  },

  // ==================== 图形测量 ====================
  {
    href: "/lessons/figure-count",
    title: "图形计数",
    desc: "网格枚举",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 3,
    category: '图形测量',
    duration: 20,
    tags: ['枚举', '空间']
  },

  // ==================== 应用题 - 1-2年级 ====================
  {
    href: "/lessons/sum-diff",
    title: "和差问题",
    desc: "和与差",
    icon: "/icons/ratio.svg",
    gradeLevel: 2,
    difficulty: 1,
    category: '应用题',
    subCategory: '和差倍',
    duration: 15,
    tags: ['基础应用题', '图解'],
    featured: true
  },
  {
    href: "/lessons/compare-more",
    title: "比多少问题",
    desc: "差值与倍数",
    icon: "/icons/ratio.svg",
    gradeLevel: 2,
    difficulty: 1,
    category: '应用题',
    subCategory: '和差倍',
    duration: 12,
    tags: ['基础应用题']
  },
  {
    href: "/lessons/move-equal",
    title: "移多补少",
    desc: "两数调整",
    icon: "/icons/ratio.svg",
    gradeLevel: 2,
    difficulty: 2,
    category: '应用题',
    subCategory: '和差倍',
    duration: 18,
    tags: ['转化', '图解']
  },
  {
    href: "/lessons/mix-add",
    title: "加法混合",
    desc: "分步求解",
    icon: "/icons/ratio.svg",
    gradeLevel: 2,
    difficulty: 1,
    category: '应用题',
    subCategory: '基础计算',
    duration: 10,
    tags: ['基础']
  },
  {
    href: "/lessons/pairing",
    title: "搭配问题",
    desc: "组合计数",
    icon: "/icons/prob.svg",
    gradeLevel: 2,
    difficulty: 2,
    category: '应用题',
    subCategory: '计数',
    duration: 15,
    tags: ['组合', '枚举']
  },
  {
    href: "/lessons/shopping",
    title: "购物问题",
    desc: "桌椅价格差",
    icon: "/icons/words.svg",
    gradeLevel: 2,
    difficulty: 2,
    category: '应用题',
    subCategory: '生活应用',
    duration: 15,
    tags: ['生活', '实用']
  },

  // ==================== 应用题 - 3-4年级 ====================
  {
    href: "/lessons/planting",
    title: "植树问题",
    desc: "段与棵数",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '应用题',
    subCategory: '植树锯木',
    duration: 18,
    tags: ['经典', '规律'],
    featured: true
  },
  {
    href: "/lessons/cut-segments",
    title: "剪绳子",
    desc: "等分与段数",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '应用题',
    subCategory: '植树锯木',
    duration: 15,
    tags: ['规律']
  },
  {
    href: "/lessons/sawing",
    title: "锯木头问题",
    desc: "段数=刀数+1",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '应用题',
    subCategory: '植树锯木',
    duration: 15,
    tags: ['规律', '可视化'],
    new: true
  },
  {
    href: "/lessons/stairs",
    title: "爬楼问题",
    desc: "步数与台阶",
    icon: "/icons/number-line.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '应用题',
    subCategory: '时间行程',
    duration: 15,
    tags: ['时间', '规律']
  },
  {
    href: "/lessons/clock",
    title: "时钟问题",
    desc: "时分读数",
    icon: "/icons/number-line.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '应用题',
    subCategory: '时间行程',
    duration: 12,
    tags: ['时间', '生活']
  },
  {
    href: "/lessons/net-weight",
    title: "净重问题",
    desc: "毛重与皮重",
    icon: "/icons/scale.svg",
    gradeLevel: 3,
    difficulty: 3,
    category: '应用题',
    subCategory: '重量容量',
    duration: 20,
    tags: ['推理', '生活']
  },
  {
    href: "/lessons/container",
    title: "容量问题",
    desc: "油桶称重",
    icon: "/icons/scale.svg",
    gradeLevel: 3,
    difficulty: 3,
    category: '应用题',
    subCategory: '重量容量',
    duration: 20,
    tags: ['推理', '方程'],
    new: true
  },
  {
    href: "/lessons/multiplier",
    title: "倍数问题",
    desc: "差÷(倍数-1)",
    icon: "/icons/ratio.svg",
    gradeLevel: 4,
    difficulty: 2,
    category: '应用题',
    subCategory: '和差倍',
    duration: 20,
    prerequisites: ["/lessons/sum-diff"],
    tags: ['公式', '可视化'],
    featured: true,
    new: true
  },
  {
    href: "/lessons/chicken-rabbit",
    title: "鸡兔同笼",
    desc: "假设法",
    icon: "/icons/scale.svg",
    gradeLevel: 4,
    difficulty: 3,
    category: '应用题',
    subCategory: '假设法',
    duration: 25,
    tags: ['经典', '假设', '交互'],
    featured: true,
    popular: true
  },
  {
    href: "/lessons/age",
    title: "年龄问题",
    desc: "和差求龄",
    icon: "/icons/ratio.svg",
    gradeLevel: 4,
    difficulty: 2,
    category: '应用题',
    subCategory: '和差倍',
    duration: 18,
    prerequisites: ["/lessons/sum-diff"],
    tags: ['推理']
  },
  {
    href: "/lessons/ticket",
    title: "车票问题",
    desc: "二元一次方程",
    icon: "/icons/scale.svg",
    gradeLevel: 4,
    difficulty: 3,
    category: '应用题',
    subCategory: '方程',
    duration: 22,
    tags: ['方程', '代数']
  },

  // ==================== 应用题 - 5-6年级 ====================
  {
    href: "/lessons/journey",
    title: "行程仿真",
    desc: "相遇与追及",
    icon: "/icons/journey.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '应用题',
    subCategory: '时间行程',
    duration: 30,
    tags: ['动画', '仿真', '重要'],
    featured: true,
    popular: true
  },
  {
    href: "/lessons/river-boat",
    title: "流水行船",
    desc: "上/下行时间",
    icon: "/icons/journey.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '应用题',
    subCategory: '时间行程',
    duration: 25,
    prerequisites: ["/lessons/journey"],
    tags: ['行程', '进阶']
  },
  {
    href: "/lessons/surplus-deficit",
    title: "盈亏问题",
    desc: "盈亏相加除以差",
    icon: "/icons/ratio.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '应用题',
    subCategory: '盈亏分配',
    duration: 22,
    tags: ['公式', '可视化'],
    new: true
  },
  {
    href: "/lessons/engineering",
    title: "工程问题",
    desc: "效率与合作",
    icon: "/icons/scale.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '应用题',
    subCategory: '工程效率',
    duration: 28,
    tags: ['重要', '分数'],
    new: true
  },
  {
    href: "/lessons/concentration",
    title: "浓度问题",
    desc: "溶质÷溶液",
    icon: "/icons/area.svg",
    gradeLevel: 6,
    difficulty: 4,
    category: '应用题',
    subCategory: '浓度配比',
    duration: 30,
    tags: ['百分数', '高难'],
    new: true
  },
  {
    href: "/lessons/series-pair",
    title: "等差配对求和",
    desc: "高斯配对法",
    icon: "/icons/number-line.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '应用题',
    subCategory: '数列',
    duration: 20,
    tags: ['经典', '配对']
  },
  {
    href: "/lessons/group-sum",
    title: "组数求和",
    desc: "配对与统计",
    icon: "/icons/number-line.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '应用题',
    subCategory: '数列',
    duration: 22,
    tags: ['配对', '统计']
  },

  // ==================== 思维训练 - 逻辑推理 ====================
  {
    href: "/lessons/fill-operators",
    title: "填写运算符号",
    desc: "逻辑推理训练",
    icon: "/icons/prob.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '思维训练',
    subCategory: '逻辑推理',
    duration: 15,
    tags: ['游戏', '推理', '交互'],
    popular: true
  },
  {
    href: "/lessons/defect-gum",
    title: "找次品(天平)",
    desc: "3v3→1v1",
    icon: "/icons/scale.svg",
    gradeLevel: 4,
    difficulty: 3,
    category: '思维训练',
    subCategory: '逻辑推理',
    duration: 20,
    tags: ['经典', '推理', '策略']
  },
  {
    href: "/lessons/algebra-transform",
    title: "括号转化",
    desc: "a−(b+c)→a−b−c",
    icon: "/icons/ratio.svg",
    gradeLevel: 4,
    difficulty: 3,
    category: '思维训练',
    subCategory: '逻辑推理',
    duration: 18,
    tags: ['代数', '转化']
  },
  {
    href: "/lessons/error-adjust",
    title: "错中求解",
    desc: "位值修正",
    icon: "/icons/ratio.svg",
    gradeLevel: 4,
    difficulty: 3,
    category: '思维训练',
    subCategory: '逻辑推理',
    duration: 20,
    tags: ['推理', '修正']
  },
  {
    href: "/lessons/grid-filling",
    title: "方格谜题",
    desc: "面积与逻辑",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '思维训练',
    subCategory: '逻辑推理',
    duration: 15,
    tags: ['游戏', '数独风格']
  },
  {
    href: "/lessons/logic-writers",
    title: "逻辑家庭推理",
    desc: "关系重叠与计数",
    icon: "/icons/words.svg",
    gradeLevel: 4,
    difficulty: 3,
    category: '思维训练',
    subCategory: '逻辑推理',
    duration: 22,
    tags: ['推理', '集合']
  },

  // ==================== 思维训练 - 空间想象 ====================
  {
    href: "/lessons/spatial-reasoning",
    title: "空间力训练",
    desc: "积木/数独/天平",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '思维训练',
    subCategory: '空间想象',
    duration: 20,
    tags: ['空间', '综合', '游戏']
  },
  {
    href: "/lessons/fifteen",
    title: "数字滑块（Fifteen）",
    desc: "滑块排序",
    icon: "/icons/area.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '思维训练',
    subCategory: '空间想象',
    duration: 15,
    tags: ['游戏', '经典', '空间'],
    popular: true
  },

  // ==================== 思维训练 - 趣味游戏 ====================
  {
    href: "/lessons/math-climbing",
    title: "数学爬阶游戏",
    desc: "答题爬梯达旗帜",
    icon: "/icons/climbing.svg",
    gradeLevel: 2,
    difficulty: 1,
    category: '思维训练',
    subCategory: '趣味游戏',
    duration: 20,
    tags: ['游戏', '激励', '综合练习'],
    featured: true,
    popular: true
  },
  {
    href: "/lessons/multiplication-crossword",
    title: "九九乘法棋盘",
    desc: "乘除法填空",
    icon: "/icons/area.svg",
    gradeLevel: 2,
    difficulty: 2,
    category: '思维训练',
    subCategory: '趣味游戏',
    duration: 15,
    tags: ['游戏', '乘法表']
  },
  {
    href: "/lessons/mines",
    title: "扫雷（Mines）",
    desc: "旗标与邻域推理",
    icon: "/icons/prob.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '思维训练',
    subCategory: '趣味游戏',
    duration: 20,
    tags: ['游戏', '经典', '推理'],
    popular: true
  },
  {
    href: "/lessons/probability",
    title: "树形概率",
    desc: "组合概率计算",
    icon: "/icons/prob.svg",
    gradeLevel: 5,
    difficulty: 3,
    category: '思维训练',
    subCategory: '趣味游戏',
    duration: 25,
    tags: ['概率', '可视化']
  },

  // ==================== AI助手 ====================
  {
    href: "/lessons/ai-generator",
    title: "AI智能出题",
    desc: "本地AI生成题目",
    icon: "/icons/prob.svg",
    gradeLevel: 'all',
    difficulty: 2,
    category: 'AI助手',
    duration: 30,
    tags: ['AI', '自动出题', '可视化'],
    featured: true,
    popular: true,
    new: true
  },

  // ==================== 语文学习 ====================
  {
    href: "/lessons/hanzi",
    title: "笔画演示",
    desc: "笔顺与临摹",
    icon: "/icons/hanzi.svg",
    gradeLevel: 1,
    difficulty: 1,
    category: '语文学习',
    subCategory: '汉字书写',
    duration: 15,
    tags: ['汉字', '笔顺', '动画'],
    featured: true
  },
  {
    href: "/lessons/words",
    title: "词语小游戏",
    desc: "近反义词练习",
    icon: "/icons/words.svg",
    gradeLevel: 2,
    difficulty: 1,
    category: '语文学习',
    subCategory: '词汇积累',
    duration: 12,
    tags: ['词语', '游戏']
  },
  {
    href: "/lessons/sentence-order",
    title: "句子重排",
    desc: "语序与表达",
    icon: "/icons/words.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '语文学习',
    subCategory: '阅读理解',
    duration: 15,
    tags: ['句子', '逻辑']
  },
  {
    href: "/lessons/punctuation",
    title: "标点练习",
    desc: "停顿与语气",
    icon: "/icons/words.svg",
    gradeLevel: 3,
    difficulty: 2,
    category: '语文学习',
    subCategory: '阅读理解',
    duration: 12,
    tags: ['标点', '语感']
  }
]

// ==================== 辅助函数 ====================

/**
 * 根据年级筛选课程
 */
export function getLessonsByGrade(grade: 1 | 2 | 3 | 4 | 5 | 6): LessonItem[] {
  return allLessons.filter(lesson =>
    lesson.gradeLevel === grade || lesson.gradeLevel === 'all'
  )
}

/**
 * 根据分类筛选课程
 */
export function getLessonsByCategory(category: CategoryType, grade?: number): LessonItem[] {
  let filtered = allLessons.filter(lesson => lesson.category === category)

  if (grade) {
    filtered = filtered.filter(lesson =>
      lesson.gradeLevel === grade || lesson.gradeLevel === 'all'
    )
  }

  return filtered
}

/**
 * 根据难度筛选课程
 */
export function getLessonsByDifficulty(difficulty: 1 | 2 | 3 | 4): LessonItem[] {
  return allLessons.filter(lesson => lesson.difficulty === difficulty)
}

/**
 * 获取精选课程
 */
export function getFeaturedLessons(grade?: number): LessonItem[] {
  let featured = allLessons.filter(lesson => lesson.featured)

  if (grade) {
    featured = featured.filter(lesson =>
      lesson.gradeLevel === grade || lesson.gradeLevel === 'all'
    )
  }

  return featured
}

/**
 * 获取热门课程
 */
export function getPopularLessons(limit: number = 6): LessonItem[] {
  return allLessons
    .filter(lesson => lesson.popular)
    .slice(0, limit)
}

/**
 * 获取新课程
 */
export function getNewLessons(limit: number = 6): LessonItem[] {
  return allLessons
    .filter(lesson => lesson.new)
    .slice(0, limit)
}

/**
 * 根据标签筛选课程
 */
export function getLessonsByTag(tag: string): LessonItem[] {
  return allLessons.filter(lesson => lesson.tags.includes(tag))
}

/**
 * 搜索课程
 */
export function searchLessons(keyword: string): LessonItem[] {
  const lowerKeyword = keyword.toLowerCase()
  return allLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(lowerKeyword) ||
    lesson.desc.toLowerCase().includes(lowerKeyword) ||
    lesson.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}

/**
 * 获取年级统计信息
 */
export function getGradeStats(grade: 1 | 2 | 3 | 4 | 5 | 6) {
  const lessons = getLessonsByGrade(grade)

  const byCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = lessons.filter(l => l.category === cat.id).length
    return acc
  }, {} as Record<CategoryType, number>)

  const byDifficulty = {
    easy: lessons.filter(l => l.difficulty === 1).length,
    medium: lessons.filter(l => l.difficulty === 2).length,
    hard: lessons.filter(l => l.difficulty === 3).length,
    challenge: lessons.filter(l => l.difficulty === 4).length
  }

  return {
    total: lessons.length,
    byCategory,
    byDifficulty,
    featured: lessons.filter(l => l.featured).length
  }
}

// ==================== 兼容旧版本的导出 ====================
// 保持向后兼容，逐步迁移

export const homeMath = getFeaturedLessons().filter(l =>
  l.category !== '语文学习'
)

export const homeChinese = allLessons.filter(l =>
  l.category === '语文学习'
)

export const grade2Topics = getLessonsByGrade(2)

export const templates = allLessons  // 所有课程都可以作为模板

// methodGroups 保持不变，用于 /methods 页面
export const methodGroups = [
  {
    label: "画图法",
    items: getLessonsByTag('可视化').slice(0, 10)
  },
  {
    label: "分析法",
    items: allLessons.filter(l =>
      l.category === '应用题' &&
      (l.subCategory === '时间行程' || l.subCategory === '工程效率')
    )
  },
  {
    label: "枚举/配对",
    items: getLessonsByTag('枚举').concat(getLessonsByTag('配对'))
  },
  {
    label: "转化法",
    items: getLessonsByTag('转化')
  },
  {
    label: "假设法",
    items: allLessons.filter(l => l.subCategory === '假设法')
  },
  {
    label: "应用场景",
    items: allLessons.filter(l =>
      l.category === '应用题' &&
      (l.subCategory === '生活应用' || l.subCategory === '重量容量')
    )
  },
  {
    label: "游戏",
    items: allLessons.filter(l =>
      l.category === '思维训练' && l.subCategory === '趣味游戏'
    ).concat(allLessons.filter(l => l.category === 'AI助手'))
  }
]
