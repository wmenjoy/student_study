// 数学题目生成系统 - 完整版本
// 包含大量应用题，支持1-6年级

export type Grade = 1 | 2 | 3 | 4 | 5 | 6
export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType = 'calculation' | 'application' | 'geometry' | 'logic'

export interface Question {
  prompt: string
  answer: string | string[]
  hint: string
  explain: string
  category: string
  grade: Grade
  type: QuestionType
  difficulty: 1 | 2 | 3  // 1=简单 2=中等 3=困难
  points: number  // 得分
  funFact?: string
}

// 工具函数
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const shuffle = <T>(arr: T[]): T[] => {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 场景数据
const names = ['小明', '小红', '小华', '小丽', '小强', '小芳', '小军', '小美', '小刚', '小玲']
const animals = ['小兔', '小猫', '小狗', '小熊', '松鼠', '小鸟', '青蛙', '蜜蜂', '蝴蝶', '小鹿']
const fruits = ['苹果', '橘子', '香蕉', '草莓', '西瓜', '葡萄', '桃子', '梨', '樱桃', '芒果']
const items = ['铅笔', '橡皮', '本子', '尺子', '书包', '文具盒', '彩笔', '贴纸', '玩具', '糖果']
const vehicles = ['汽车', '火车', '飞机', '轮船', '自行车', '摩托车', '公交车', '出租车']
const places = ['学校', '公园', '图书馆', '超市', '动物园', '游乐场', '电影院', '博物馆']

// ==================== 一年级题目 ====================
function generateGrade1Questions(): Question[] {
  const questions: Question[] = []

  // 基础计算
  for (let i = 0; i < 6; i++) {
    const a = rand(5, 12)
    const b = rand(3, 8)
    questions.push({
      prompt: `${a} + ${b} = ?`,
      answer: String(a + b),
      hint: `从${a}开始往后数${b}个`,
      explain: `${a} + ${b} = ${a + b}`,
      category: '20以内加法',
      grade: 1, type: 'calculation', difficulty: 1, points: 10
    })
  }

  // 应用题 - 购物场景
  for (let i = 0; i < 4; i++) {
    const item1 = pick(items)
    const item2 = pick(items.filter(x => x !== item1))
    const price1 = rand(2, 8)
    const price2 = rand(2, 8)
    const name = pick(names)
    questions.push({
      prompt: `${name}买了一支${item1}${price1}元，一块${item2}${price2}元，一共花了多少元？`,
      answer: String(price1 + price2),
      hint: '把两个价格加起来',
      explain: `${price1} + ${price2} = ${price1 + price2}元`,
      category: '购物问题',
      grade: 1, type: 'application', difficulty: 2, points: 15,
      funFact: '购物时要学会计算总价哦！'
    })
  }

  // 应用题 - 分配问题
  for (let i = 0; i < 4; i++) {
    const total = rand(10, 18)
    const given = rand(3, total - 3)
    const name = pick(names)
    const fruit = pick(fruits)
    questions.push({
      prompt: `${name}有${total}个${fruit}，送给朋友${given}个后，还剩多少个？`,
      answer: String(total - given),
      hint: '用减法，原来的减去送出的',
      explain: `${total} - ${given} = ${total - given}个`,
      category: '减法应用',
      grade: 1, type: 'application', difficulty: 2, points: 15
    })
  }

  // 应用题 - 比较问题
  for (let i = 0; i < 3; i++) {
    const a = rand(8, 15)
    const b = rand(3, a - 2)
    const name1 = pick(names)
    const name2 = pick(names.filter(x => x !== name1))
    const item = pick(items)
    questions.push({
      prompt: `${name1}有${a}个${item}，${name2}有${b}个，${name1}比${name2}多多少个？`,
      answer: String(a - b),
      hint: '多多少就是两个数相减',
      explain: `${a} - ${b} = ${a - b}，${name1}比${name2}多${a - b}个`,
      category: '比较问题',
      grade: 1, type: 'application', difficulty: 2, points: 15
    })
  }

  // 钟表问题
  const clockTimes = [
    { h: 7, desc: '起床时间', answer: '7' },
    { h: 8, desc: '上学时间', answer: '8' },
    { h: 12, desc: '午餐时间', answer: '12' },
    { h: 3, desc: '放学时间', answer: '3' },
  ]
  for (const ct of clockTimes) {
    questions.push({
      prompt: `${ct.desc}是${ct.h}点整，用数字表示是几点？`,
      answer: ct.answer,
      hint: '整点只写小时数',
      explain: `${ct.h}点整写作${ct.answer}`,
      category: '认识钟表',
      grade: 1, type: 'application', difficulty: 1, points: 10
    })
  }

  // 图形问题
  const shapes = [
    { name: '长方体', example: '冰箱、书本' },
    { name: '正方体', example: '骰子、魔方' },
    { name: '圆柱', example: '水杯、易拉罐' },
    { name: '球', example: '篮球、地球仪' }
  ]
  for (const shape of shapes) {
    questions.push({
      prompt: `${shape.example}是什么形状？`,
      answer: shape.name,
      hint: '想想这些物体的特征',
      explain: `${shape.example}是${shape.name}`,
      category: '立体图形',
      grade: 1, type: 'geometry', difficulty: 1, points: 10
    })
  }

  // 逻辑推理
  for (let i = 0; i < 3; i++) {
    const nums = [rand(1, 5), rand(6, 10), rand(11, 15)]
    const sorted = [...nums].sort((a, b) => a - b)
    questions.push({
      prompt: `把${nums.join('、')}从小到大排列，最小的是？`,
      answer: String(sorted[0]),
      hint: '比较三个数的大小',
      explain: `从小到大：${sorted.join(' < ')}，最小是${sorted[0]}`,
      category: '数的比较',
      grade: 1, type: 'logic', difficulty: 1, points: 10
    })
  }

  return shuffle(questions)
}

// ==================== 二年级题目 ====================
function generateGrade2Questions(): Question[] {
  const questions: Question[] = []

  // 乘法应用题
  for (let i = 0; i < 6; i++) {
    const rows = rand(3, 8)
    const cols = rand(2, 6)
    const scenarios = [
      `教室里有${rows}排桌子，每排${cols}张，一共有多少张桌子？`,
      `${pick(names)}买了${rows}盒${pick(fruits)}，每盒${cols}个，一共有多少个？`,
      `停车场有${rows}行车位，每行能停${cols}辆车，最多能停多少辆？`
    ]
    questions.push({
      prompt: pick(scenarios),
      answer: String(rows * cols),
      hint: '几个几就用乘法',
      explain: `${rows} × ${cols} = ${rows * cols}`,
      category: '乘法应用',
      grade: 2, type: 'application', difficulty: 2, points: 15
    })
  }

  // 除法应用题 - 平均分
  for (let i = 0; i < 6; i++) {
    const people = rand(3, 8)
    const each = rand(2, 6)
    const total = people * each
    const item = pick(items)
    const name = pick(names)
    questions.push({
      prompt: `${name}有${total}个${item}，平均分给${people}个小朋友，每人分几个？`,
      answer: String(each),
      hint: '平均分就是除法',
      explain: `${total} ÷ ${people} = ${each}，每人${each}个`,
      category: '平均分问题',
      grade: 2, type: 'application', difficulty: 2, points: 15
    })
  }

  // 时间问题
  for (let i = 0; i < 4; i++) {
    const h1 = rand(8, 11)
    const m1 = rand(0, 2) * 15
    const duration = rand(1, 3) * 30
    let h2 = h1
    let m2 = m1 + duration
    while (m2 >= 60) { h2++; m2 -= 60 }

    questions.push({
      prompt: `电影${h1}时${m1 || '00'}分开始，放映${duration}分钟，几时几分结束？`,
      answer: [`${h2}时${m2}分`, `${h2}:${m2.toString().padStart(2, '0')}`],
      hint: '开始时间加上持续时间',
      explain: `${h1}:${m1.toString().padStart(2, '0')} + ${duration}分 = ${h2}:${m2.toString().padStart(2, '0')}`,
      category: '时间计算',
      grade: 2, type: 'application', difficulty: 2, points: 15
    })
  }

  // 长度单位换算
  for (let i = 0; i < 4; i++) {
    const type = rand(1, 3)
    let prompt: string, answer: string
    if (type === 1) {
      const m = rand(2, 8)
      prompt = `${m}米 = ?厘米`
      answer = String(m * 100)
    } else if (type === 2) {
      const cm = rand(2, 5) * 100
      prompt = `${cm}厘米 = ?米`
      answer = String(cm / 100)
    } else {
      const m = rand(1, 3)
      const cm = rand(10, 50)
      prompt = `${m}米${cm}厘米 = ?厘米`
      answer = String(m * 100 + cm)
    }
    questions.push({
      prompt, answer,
      hint: '1米 = 100厘米',
      explain: `${prompt.replace('?', answer)}`,
      category: '长度换算',
      grade: 2, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 两步计算应用题
  for (let i = 0; i < 4; i++) {
    const price = rand(3, 8)
    const count = rand(2, 5)
    const money = price * count + rand(5, 15)
    const name = pick(names)
    const item = pick(items)
    questions.push({
      prompt: `${name}带了${money}元，买了${count}支${item}，每支${price}元，还剩多少元？`,
      answer: String(money - price * count),
      hint: '先算花了多少，再算剩下多少',
      explain: `花了 ${price}×${count}=${price*count}元，剩 ${money}-${price*count}=${money-price*count}元`,
      category: '两步计算',
      grade: 2, type: 'application', difficulty: 3, points: 20
    })
  }

  // 角的认识
  const angleQuestions = [
    { desc: '时钟3点整时，时针和分针形成的角', answer: '直角', hint: '90度的角' },
    { desc: '三角尺上最尖的那个角', answer: '锐角', hint: '小于90度' },
    { desc: '钝角三角形中最大的那个角', answer: '钝角', hint: '大于90度' }
  ]
  for (const aq of angleQuestions) {
    questions.push({
      prompt: `${aq.desc}是什么角？`,
      answer: aq.answer,
      hint: aq.hint,
      explain: `这是${aq.answer}`,
      category: '角的认识',
      grade: 2, type: 'geometry', difficulty: 2, points: 15
    })
  }

  return shuffle(questions)
}

// ==================== 三年级题目 ====================
function generateGrade3Questions(): Question[] {
  const questions: Question[] = []

  // 多位数乘一位数应用题
  for (let i = 0; i < 3; i++) {
    const perUnit = rand(12, 35)
    const units = rand(3, 8)
    const total = perUnit * units
    const name = pick(names)
    const item = pick(items)

    const type = rand(1, 4)
    let prompt: string

    if (type === 1) {
      prompt = `${name}每天读${perUnit}页书，${units}天一共读多少页？`
    } else if (type === 2) {
      prompt = `每箱${item}有${perUnit}个，${units}箱一共有多少个？`
    } else if (type === 3) {
      prompt = `学校每层楼有${perUnit}个教室，${units}层楼一共有多少个教室？`
    } else {
      prompt = `${name}每小时能做${perUnit}道题，${units}小时能做多少道题？`
    }

    questions.push({
      prompt,
      answer: String(total),
      hint: '用乘法：每份数量 × 份数 = 总数',
      explain: `${perUnit} × ${units} = ${total}`,
      category: '乘法应用',
      grade: 3, type: 'application', difficulty: 2, points: 15
    })
  }

  // 和差问题
  for (let i = 0; i < 3; i++) {
    const small = rand(10, 30)
    const diff = rand(5, 15)
    const big = small + diff
    const sum = small + big
    const name1 = pick(names)
    const name2 = pick(names.filter(n => n !== name1))
    const item = pick(items)

    questions.push({
      prompt: `${name1}和${name2}共有${sum}个${item}，${name1}比${name2}多${diff}个，${name1}有多少个？`,
      answer: String(big),
      hint: '(和+差)÷2=大数',
      explain: `(${sum}+${diff})÷2=${big}个`,
      category: '和差问题',
      grade: 3, type: 'application', difficulty: 2, points: 15
    })
  }

  // 倍数问题 - 桌椅问题类型
  for (let i = 0; i < 3; i++) {
    const chairPrice = rand(20, 40)
    const mult = rand(8, 12)
    const diff = chairPrice * (mult - 1)
    const tablePrice = chairPrice * mult

    questions.push({
      prompt: `一张桌子的价钱是一把椅子的${mult}倍，一张桌子比一把椅子多${diff}元，一把椅子多少元？`,
      answer: String(chairPrice),
      hint: '多的钱数÷(倍数-1)=椅子价钱',
      explain: `${diff}÷(${mult}-1)=${chairPrice}元`,
      category: '倍数问题',
      grade: 3, type: 'application', difficulty: 3, points: 20,
      funFact: '多出的差正好是小数的(倍数-1)倍！'
    })
  }

  // 差倍问题 - 苹果梨问题
  for (let i = 0; i < 2; i++) {
    const boxWeight = rand(10, 20)
    const boxes = 3
    const extraPerBox = rand(3, 8)
    const appleTotal = boxWeight * boxes
    const pearTotal = appleTotal + extraPerBox * boxes

    questions.push({
      prompt: `${boxes}箱苹果重${appleTotal}千克，一箱梨比一箱苹果多${extraPerBox}千克，${boxes}箱梨重多少千克？`,
      answer: String(pearTotal),
      hint: '苹果总重+每箱多的×箱数',
      explain: `${appleTotal}+${extraPerBox}×${boxes}=${pearTotal}千克`,
      category: '差倍问题',
      grade: 3, type: 'application', difficulty: 2, points: 15
    })
  }

  // 锯木头问题
  for (let i = 0; i < 2; i++) {
    const segments = rand(4, 8)
    const timePerCut = rand(2, 5)
    const totalTime = (segments - 1) * timePerCut

    questions.push({
      prompt: `把一根木料锯成${segments}段需要${totalTime}分钟，用同样的速度锯成${segments + 2}段需要多少分钟？`,
      answer: String((segments + 2 - 1) * timePerCut),
      hint: '锯成n段需要(n-1)次',
      explain: `每次${totalTime}÷${segments - 1}=${timePerCut}分钟，${segments + 2}段需要${segments + 1}次=${(segments + 1) * timePerCut}分钟`,
      category: '锯木问题',
      grade: 3, type: 'application', difficulty: 2, points: 15,
      funFact: '段数比刀数多1！'
    })
  }

  // 除法应用题
  for (let i = 0; i < 5; i++) {
    const divisor = rand(3, 9)
    const quotient = rand(12, 35)
    const dividend = divisor * quotient
    const scenarios = [
      `${dividend}本书平均放在${divisor}个书架上，每个书架放几本？`,
      `${pick(names)}${divisor}天跑了${dividend}米，平均每天跑多少米？`,
      `${dividend}元买${divisor}个面包，每个多少元？`
    ]
    questions.push({
      prompt: pick(scenarios),
      answer: String(quotient),
      hint: '用除法计算',
      explain: `${dividend} ÷ ${divisor} = ${quotient}`,
      category: '除法应用',
      grade: 3, type: 'application', difficulty: 2, points: 15
    })
  }

  // 周长问题
  for (let i = 0; i < 4; i++) {
    const l = rand(8, 20)
    const w = rand(4, l - 2)
    questions.push({
      prompt: `长方形操场长${l}米，宽${w}米，围着操场跑一圈是多少米？`,
      answer: String((l + w) * 2),
      hint: '周长 = (长+宽) × 2',
      explain: `(${l} + ${w}) × 2 = ${(l + w) * 2}米`,
      category: '周长问题',
      grade: 3, type: 'geometry', difficulty: 2, points: 15
    })
  }

  // 年月日问题
  const dateQuestions = [
    { q: '小明1月15日出生，到3月15日满几个月？', a: '2' },
    { q: '平年全年有多少天？', a: '365' },
    { q: '闰年2月有多少天？', a: '29' },
    { q: '一年有几个大月（31天的月份）？', a: '7' }
  ]
  for (const dq of dateQuestions) {
    questions.push({
      prompt: dq.q,
      answer: dq.a,
      hint: '回忆年月日的知识',
      explain: `答案是${dq.a}`,
      category: '年月日',
      grade: 3, type: 'application', difficulty: 2, points: 15
    })
  }

  // 分数问题
  for (let i = 0; i < 4; i++) {
    const total = pick([4, 6, 8, 10])
    const part = rand(1, total - 1)
    const food = pick(fruits)
    questions.push({
      prompt: `把一个${food}平均切成${total}块，吃了${part}块，吃了几分之几？`,
      answer: `${part}/${total}`,
      hint: '吃了的块数做分子，总块数做分母',
      explain: `吃了 ${part}/${total}`,
      category: '分数认识',
      grade: 3, type: 'application', difficulty: 2, points: 15
    })
  }

  // 质量问题
  for (let i = 0; i < 3; i++) {
    const kg = rand(2, 8)
    const g = kg * 1000
    const scenarios = [
      { q: `${kg}千克大米等于多少克？`, a: String(g) },
      { q: `${g}克面粉等于多少千克？`, a: String(kg) }
    ]
    const s = pick(scenarios)
    questions.push({
      prompt: s.q,
      answer: s.a,
      hint: '1千克 = 1000克',
      explain: `${s.q.replace('？', s.a)}`,
      category: '质量单位',
      grade: 3, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 植树问题
  for (let i = 0; i < 3; i++) {
    const trees = rand(6, 15)
    const space = rand(3, 8)
    const length = (trees - 1) * space
    questions.push({
      prompt: `一条路一边种了${trees}棵树，每两棵树之间相距${space}米，这条路长多少米？`,
      answer: String(length),
      hint: '间隔数 = 树的棵数 - 1',
      explain: `间隔有${trees-1}个，路长 = ${trees-1} × ${space} = ${length}米`,
      category: '植树问题',
      grade: 3, type: 'application', difficulty: 3, points: 20,
      funFact: '记住：间隔数比棵数少1！'
    })
  }

  // 购物问题 - 购买铅笔类型
  for (let i = 0; i < 3; i++) {
    const price = rand(2, 8) / 10  // 0.2-0.8元
    const total1 = rand(8, 15)
    const total2 = rand(4, total1 - 2)
    const avgCount = (total1 + total2) / 2
    const diff = total1 - avgCount
    const money = diff * price

    questions.push({
      prompt: `两人付同样多的钱买铅笔，${pick(names)}买了${total1}支，${pick(names)}买了${total2}支，${pick(names)}给${pick(names)}${money.toFixed(1)}元钱。每支铅笔多少元？`,
      answer: String(price),
      hint: '先算平均每人应得几支',
      explain: `平均每人 (${total1}+${total2})÷2=${avgCount}支，多出${diff}支值${money}元，每支 ${money}÷${diff}=${price}元`,
      category: '购物问题',
      grade: 3, type: 'application', difficulty: 3, points: 20
    })
  }

  // 油桶问题 - 连桶称重
  for (let i = 0; i < 2; i++) {
    const bucketWeight = rand(2, 5)
    const oilWeight = rand(10, 20)
    const fullWeight = oilWeight + bucketWeight
    const halfWeight = oilWeight / 2 + bucketWeight

    questions.push({
      prompt: `一桶油连桶重${fullWeight}千克，用去一半油后，连桶重${halfWeight}千克。桶重多少千克？`,
      answer: String(bucketWeight),
      hint: '两次重量差就是半桶油的重量',
      explain: `半桶油重 ${fullWeight}-${halfWeight}=${oilWeight/2}千克，全桶油${oilWeight}千克，桶重${fullWeight}-${oilWeight}=${bucketWeight}千克`,
      category: '容量问题',
      grade: 3, type: 'application', difficulty: 3, points: 20
    })
  }

  // 分书问题
  for (let i = 0; i < 2; i++) {
    const small = rand(10, 20)
    const give = rand(3, 8)
    const big = small + give * 2
    const total = big + small

    questions.push({
      prompt: `${pick(names)}和${pick(names)}共有${total}本书，${pick(names)}给${pick(names)}${give}本后两人同样多，原来各有多少本？`,
      answer: `${big}和${small}`,
      hint: '给出的数量是差的一半',
      explain: `差=${give}×2=${give*2}本，多的有(${total}+${give*2})÷2=${big}本，少的有${small}本`,
      category: '分配问题',
      grade: 3, type: 'application', difficulty: 3, points: 20
    })
  }

  return shuffle(questions)
}

// ==================== 四年级题目 ====================
function generateGrade4Questions(): Question[] {
  const questions: Question[] = []

  // 混合运算
  for (let i = 0; i < 6; i++) {
    const type = rand(1, 4)
    let prompt: string, answer: number, explain: string

    if (type === 1) {
      const a = rand(50, 150)
      const b = rand(10, 30)
      const c = rand(2, 5)
      answer = a - b * c
      prompt = `${a} - ${b} × ${c} = ?`
      explain = `先乘后减：${a} - ${b * c} = ${answer}`
    } else if (type === 2) {
      const a = rand(100, 300)
      const b = rand(20, 60)
      const c = rand(2, 5)
      answer = a + b / c
      prompt = `${a} + ${b} ÷ ${c} = ?`
      explain = `先除后加：${a} + ${b / c} = ${answer}`
    } else if (type === 3) {
      const a = rand(10, 30)
      const b = rand(5, 15)
      const c = rand(2, 6)
      answer = (a + b) * c
      prompt = `(${a} + ${b}) × ${c} = ?`
      explain = `先算括号：${a + b} × ${c} = ${answer}`
    } else {
      const a = rand(100, 200)
      const b = rand(30, 80)
      const c = rand(2, 5)
      answer = (a - b) / c
      prompt = `(${a} - ${b}) ÷ ${c} = ?`
      explain = `先算括号：${a - b} ÷ ${c} = ${answer}`
    }

    questions.push({
      prompt, answer: String(answer),
      hint: '先算括号，再算乘除，最后算加减',
      explain,
      category: '混合运算',
      grade: 4, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 行程问题 - 相遇
  for (let i = 0; i < 4; i++) {
    const v1 = rand(40, 80)
    const v2 = rand(40, 80)
    const time = rand(2, 5)
    const dist = (v1 + v2) * time
    const place1 = pick(places)
    const place2 = pick(places.filter(p => p !== place1))

    questions.push({
      prompt: `${place1}和${place2}相距${dist}千米，甲车每小时行${v1}千米，乙车每小时行${v2}千米，两车同时从两地相向而行，几小时后相遇？`,
      answer: String(time),
      hint: '相遇时间 = 路程 ÷ 速度和',
      explain: `${dist} ÷ (${v1} + ${v2}) = ${time}小时`,
      category: '行程问题',
      grade: 4, type: 'application', difficulty: 3, points: 20,
      funFact: '相向而行时，速度要相加！'
    })
  }

  // 小数计算
  for (let i = 0; i < 4; i++) {
    const a = (rand(20, 80) / 10).toFixed(1)
    const b = (rand(10, 50) / 10).toFixed(1)
    const isAdd = rand(0, 1)

    if (isAdd) {
      const result = (parseFloat(a) + parseFloat(b)).toFixed(1)
      questions.push({
        prompt: `${a} + ${b} = ?`,
        answer: result.replace(/\.0$/, ''),
        hint: '小数点对齐计算',
        explain: `${a} + ${b} = ${result}`,
        category: '小数加减',
        grade: 4, type: 'calculation', difficulty: 2, points: 15
      })
    } else {
      const big = Math.max(parseFloat(a), parseFloat(b))
      const small = Math.min(parseFloat(a), parseFloat(b))
      const result = (big - small).toFixed(1)
      questions.push({
        prompt: `${big} - ${small} = ?`,
        answer: result.replace(/\.0$/, ''),
        hint: '小数点对齐计算',
        explain: `${big} - ${small} = ${result}`,
        category: '小数加减',
        grade: 4, type: 'calculation', difficulty: 2, points: 15
      })
    }
  }

  // 面积问题
  for (let i = 0; i < 4; i++) {
    const l = rand(8, 25)
    const w = rand(5, l - 2)
    const area = l * w
    questions.push({
      prompt: `长方形菜地长${l}米，宽${w}米，面积是多少平方米？`,
      answer: String(area),
      hint: '面积 = 长 × 宽',
      explain: `${l} × ${w} = ${area}平方米`,
      category: '面积计算',
      grade: 4, type: 'geometry', difficulty: 2, points: 15
    })
  }

  // 单价数量总价
  for (let i = 0; i < 4; i++) {
    const type = rand(1, 3)
    const item = pick(items)
    const name = pick(names)

    if (type === 1) {
      const price = rand(5, 20)
      const count = rand(3, 10)
      questions.push({
        prompt: `${name}买了${count}个${item}，每个${price}元，一共多少元？`,
        answer: String(price * count),
        hint: '总价 = 单价 × 数量',
        explain: `${price} × ${count} = ${price * count}元`,
        category: '数量关系',
        grade: 4, type: 'application', difficulty: 2, points: 15
      })
    } else if (type === 2) {
      const total = rand(50, 200)
      const count = rand(5, 10)
      const price = total / count
      questions.push({
        prompt: `${name}花${total}元买了${count}本书，每本多少元？`,
        answer: String(price),
        hint: '单价 = 总价 ÷ 数量',
        explain: `${total} ÷ ${count} = ${price}元`,
        category: '数量关系',
        grade: 4, type: 'application', difficulty: 2, points: 15
      })
    } else {
      const price = rand(8, 25)
      const total = price * rand(5, 12)
      const count = total / price
      questions.push({
        prompt: `${item}每个${price}元，${total}元能买几个？`,
        answer: String(count),
        hint: '数量 = 总价 ÷ 单价',
        explain: `${total} ÷ ${price} = ${count}个`,
        category: '数量关系',
        grade: 4, type: 'application', difficulty: 2, points: 15
      })
    }
  }

  // 鸡兔同笼简化版
  for (let i = 0; i < 2; i++) {
    const rabbits = rand(3, 8)
    const chickens = rand(5, 12)
    const heads = rabbits + chickens
    const legs = rabbits * 4 + chickens * 2
    questions.push({
      prompt: `笼子里有鸡和兔共${heads}只，数腿有${legs}条，兔子有几只？`,
      answer: String(rabbits),
      hint: '假设全是鸡，多出的腿数除以2就是兔子数',
      explain: `假设全鸡：${heads}×2=${heads*2}条腿，多出${legs-heads*2}条，兔子=${(legs-heads*2)/2}只`,
      category: '鸡兔同笼',
      grade: 4, type: 'logic', difficulty: 3, points: 25,
      funFact: '这是一道古老的数学趣题，出自《孙子算经》！'
    })
  }

  // 追及问题
  for (let i = 0; i < 3; i++) {
    const vFast = rand(50, 80)
    const vSlow = rand(30, vFast - 10)
    const time = rand(2, 5)
    const distance = (vFast - vSlow) * time
    const name1 = pick(names)
    const name2 = pick(names.filter(n => n !== name1))

    questions.push({
      prompt: `${name1}每小时走${vFast}千米，${name2}每小时走${vSlow}千米，${name1}在${name2}后面${distance}千米，${name1}几小时能追上${name2}？`,
      answer: String(time),
      hint: '追及时间 = 路程差 ÷ 速度差',
      explain: `${distance} ÷ (${vFast} - ${vSlow}) = ${time}小时`,
      category: '追及问题',
      grade: 4, type: 'application', difficulty: 3, points: 20,
      funFact: '追及问题的关键是速度差！'
    })
  }

  // 年龄问题
  for (let i = 0; i < 3; i++) {
    const childAge = rand(8, 15)
    const parentAge = childAge + rand(22, 30)
    const yearsLater = rand(3, 8)
    const futureChild = childAge + yearsLater
    const futureParent = parentAge + yearsLater

    questions.push({
      prompt: `今年孩子${childAge}岁，父亲${parentAge}岁，${yearsLater}年后父亲的年龄是孩子的几倍？`,
      answer: String(Math.floor(futureParent / futureChild)),
      hint: '先算出几年后各自的年龄',
      explain: `${yearsLater}年后：孩子${futureChild}岁，父亲${futureParent}岁，${futureParent}÷${futureChild}=${Math.floor(futureParent/futureChild)}倍`,
      category: '年龄问题',
      grade: 4, type: 'application', difficulty: 3, points: 20
    })
  }

  // 盈亏问题
  for (let i = 0; i < 3; i++) {
    const people = rand(8, 15)
    const perPerson1 = rand(3, 6)
    const perPerson2 = perPerson1 + rand(1, 3)
    const surplus = rand(3, 10)
    const shortage = people * perPerson2 - (people * perPerson1 + surplus)
    const total = people * perPerson1 + surplus

    questions.push({
      prompt: `分${pick(items)}，每人分${perPerson1}个还多${surplus}个，每人分${perPerson2}个还少${shortage}个，有多少人？`,
      answer: String(people),
      hint: '人数 = (多的+少的) ÷ (每人多分-每人少分)',
      explain: `(${surplus}+${shortage}) ÷ (${perPerson2}-${perPerson1}) = ${people}人`,
      category: '盈亏问题',
      grade: 4, type: 'application', difficulty: 3, points: 20,
      funFact: '盈亏问题就是"多了和少了"的问题！'
    })
  }

  // 植树问题 - 环形
  for (let i = 0; i < 2; i++) {
    const trees = rand(10, 20)
    const space = rand(3, 6)
    const length = trees * space

    questions.push({
      prompt: `圆形花坛周长${length}米，每隔${space}米种一棵树，一共要种多少棵？`,
      answer: String(trees),
      hint: '环形植树：棵数 = 周长 ÷ 间距',
      explain: `${length} ÷ ${space} = ${trees}棵`,
      category: '植树问题',
      grade: 4, type: 'application', difficulty: 2, points: 15,
      funFact: '环形植树不用加1，因为首尾相连！'
    })
  }

  // 购买桌椅问题
  for (let i = 0; i < 3; i++) {
    const chairPrice = rand(20, 50)
    const tableDiff = rand(20, 40)
    const tablePrice = chairPrice + tableDiff
    const tableCount = rand(4, 8)
    const chairCount = rand(3, 7)
    const total = tablePrice * tableCount + chairPrice * chairCount

    questions.push({
      prompt: `${tableCount}张桌子和${chairCount}把椅子共${total}元，每张桌子比椅子贵${tableDiff}元，桌子和椅子各多少元？`,
      answer: `${tablePrice}和${chairPrice}`,
      hint: '先消除差价，转化为单一变量',
      explain: `设椅子x元，桌子(x+${tableDiff})元。${tableCount}(x+${tableDiff})+${chairCount}x=${total}，解得椅子${chairPrice}元，桌子${tablePrice}元`,
      category: '购物问题',
      grade: 4, type: 'application', difficulty: 3, points: 20
    })
  }

  // 五桶油问题
  for (let i = 0; i < 2; i++) {
    const perBucket = rand(20, 40)
    const total = perBucket * 5
    const big = perBucket * 2
    const small = perBucket

    questions.push({
      prompt: `5桶油，大桶装的是小桶的2倍。大桶比小桶共多装${big - small}千克，每桶各装多少千克？`,
      answer: `${big}和${small}`,
      hint: '大桶比小桶多装1倍',
      explain: `多装的${big-small}千克就是小桶的容量，小桶${small}千克，大桶${big}千克`,
      category: '容量问题',
      grade: 4, type: 'application', difficulty: 3, points: 20
    })
  }

  // 行程问题 - 快慢车
  for (let i = 0; i < 2; i++) {
    const fastSpeed = rand(60, 90)
    const slowSpeed = rand(40, fastSpeed - 15)
    const time = rand(2, 5)
    const totalDist = (fastSpeed + slowSpeed) * time
    const diffDist = (fastSpeed - slowSpeed) * time

    questions.push({
      prompt: `两地相距${totalDist}千米，快车每小时${fastSpeed}千米，慢车每小时${slowSpeed}千米，相向而行${time}小时相遇。快车比慢车多行多少千米？`,
      answer: String(diffDist),
      hint: '速度差×时间=路程差',
      explain: `(${fastSpeed}-${slowSpeed})×${time}=${diffDist}千米`,
      category: '行程问题',
      grade: 4, type: 'application', difficulty: 3, points: 20
    })
  }

  // 倒油相等问题
  for (let i = 0; i < 2; i++) {
    const small = rand(10, 20)
    const big = small * rand(3, 5)
    const pour = (big - small) / 2

    questions.push({
      prompt: `甲桶有油${big}千克，乙桶有油${small}千克，从甲桶倒多少千克到乙桶，两桶油相等？`,
      answer: String(pour),
      hint: '倒出量=(多-少)÷2',
      explain: `(${big}-${small})÷2=${pour}千克`,
      category: '容量问题',
      grade: 4, type: 'application', difficulty: 2, points: 15
    })
  }

  // 男女工人调配
  for (let i = 0; i < 2; i++) {
    const diff = rand(30, 50)
    const transfer = rand(10, 20)
    const female = diff + transfer * 3  // 调出后男=女×2，设女=x，则男=2x，差=x
    const male = female + diff

    questions.push({
      prompt: `女工比男工少${diff}人，各调出${transfer}人后，男工是女工的2倍。原来男女工各多少人？`,
      answer: `${male}和${female}`,
      hint: '设调出后女工x人，男工2x人',
      explain: `调出后女工=(${diff}+${transfer}×3)÷3+${transfer}=...，男工${male}人，女工${female}人`,
      category: '分配问题',
      grade: 4, type: 'application', difficulty: 3, points: 25
    })
  }

  return shuffle(questions)
}

// ==================== 五年级题目 ====================
function generateGrade5Questions(): Question[] {
  const questions: Question[] = []

  // 小数乘除法
  for (let i = 0; i < 5; i++) {
    const type = rand(1, 2)
    if (type === 1) {
      const a = (rand(15, 45) / 10).toFixed(1)
      const b = rand(3, 8)
      const result = (parseFloat(a) * b).toFixed(1)
      questions.push({
        prompt: `${a} × ${b} = ?`,
        answer: result.replace(/\.0$/, ''),
        hint: '先按整数乘，再点小数点',
        explain: `${a} × ${b} = ${result}`,
        category: '小数乘法',
        grade: 5, type: 'calculation', difficulty: 2, points: 15
      })
    } else {
      const b = (rand(2, 6) / 10).toFixed(1)
      const c = rand(8, 25)
      const a = (parseFloat(b) * c).toFixed(1)
      questions.push({
        prompt: `${a} ÷ ${b} = ?`,
        answer: String(c),
        hint: '转化为整数除法',
        explain: `${a} ÷ ${b} = ${c}`,
        category: '小数除法',
        grade: 5, type: 'calculation', difficulty: 2, points: 15
      })
    }
  }

  // 分数计算
  for (let i = 0; i < 4; i++) {
    const denom = pick([3, 4, 5, 6, 8])
    const n1 = rand(1, denom - 2)
    const n2 = rand(1, denom - n1 - 1)
    questions.push({
      prompt: `${n1}/${denom} + ${n2}/${denom} = ?`,
      answer: `${n1 + n2}/${denom}`,
      hint: '同分母分数相加，分母不变',
      explain: `${n1}/${denom} + ${n2}/${denom} = ${n1 + n2}/${denom}`,
      category: '分数加法',
      grade: 5, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 方程问题
  const equations = [
    { q: 'x + 18 = 45', a: '27', hint: 'x = 45 - 18' },
    { q: '3x = 36', a: '12', hint: 'x = 36 ÷ 3' },
    { q: '2x + 5 = 17', a: '6', hint: '先减5再除以2' },
    { q: 'x - 12 = 28', a: '40', hint: 'x = 28 + 12' },
    { q: '5x = 45', a: '9', hint: 'x = 45 ÷ 5' }
  ]
  for (const eq of equations) {
    questions.push({
      prompt: `解方程：${eq.q}，x = ?`,
      answer: eq.a,
      hint: eq.hint,
      explain: `x = ${eq.a}`,
      category: '简易方程',
      grade: 5, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 工程问题 - 确保答案是整数
  for (let i = 0; i < 3; i++) {
    // 选择能整除的数对
    const pairs = [
      [6, 12], [8, 24], [10, 15], [12, 20], [6, 18], [10, 20], [12, 18], [15, 30]
    ]
    const [a, b] = pick(pairs)
    const together = (a * b) / (a + b)
    questions.push({
      prompt: `一项工程，甲单独做${a}天完成，乙单独做${b}天完成，两人合做几天完成？`,
      answer: String(together),
      hint: '合做时间 = 1 ÷ (1/甲天数 + 1/乙天数)',
      explain: `甲每天做1/${a}，乙每天做1/${b}，合做每天1/${a}+1/${b}，共需${together}天`,
      category: '工程问题',
      grade: 5, type: 'application', difficulty: 3, points: 25
    })
  }

  // 三角形面积 - 确保结果是整数
  for (let i = 0; i < 4; i++) {
    const base = rand(4, 12) * 2  // 偶数底边
    const height = rand(3, 10)
    const area = base * height / 2
    questions.push({
      prompt: `三角形底${base}厘米，高${height}厘米，面积是多少平方厘米？`,
      answer: String(area),
      hint: '面积 = 底 × 高 ÷ 2',
      explain: `${base} × ${height} ÷ 2 = ${area}平方厘米`,
      category: '三角形面积',
      grade: 5, type: 'geometry', difficulty: 2, points: 15
    })
  }

  // 长方体体积
  for (let i = 0; i < 3; i++) {
    const l = rand(4, 10)
    const w = rand(3, 8)
    const h = rand(2, 6)
    const volume = l * w * h
    questions.push({
      prompt: `长方体长${l}厘米、宽${w}厘米、高${h}厘米，体积是多少立方厘米？`,
      answer: String(volume),
      hint: '体积 = 长 × 宽 × 高',
      explain: `${l} × ${w} × ${h} = ${volume}立方厘米`,
      category: '体积计算',
      grade: 5, type: 'geometry', difficulty: 2, points: 15
    })
  }

  // 概率问题
  for (let i = 0; i < 3; i++) {
    const red = rand(2, 6)
    const blue = rand(2, 6)
    const total = red + blue
    questions.push({
      prompt: `袋中有${red}个红球和${blue}个蓝球，随机摸一个，摸到红球的概率是多少？`,
      answer: `${red}/${total}`,
      hint: '概率 = 有利情况 ÷ 所有情况',
      explain: `P(红球) = ${red}/${total}`,
      category: '概率初步',
      grade: 5, type: 'application', difficulty: 2, points: 15
    })
  }

  // 因数倍数
  const factorQuestions = [
    { q: '12和18的最大公因数是？', a: '6' },
    { q: '4和6的最小公倍数是？', a: '12' },
    { q: '15和20的最大公因数是？', a: '5' },
    { q: '3和7的最小公倍数是？', a: '21' }
  ]
  for (const fq of factorQuestions) {
    questions.push({
      prompt: fq.q,
      answer: fq.a,
      hint: '分解质因数找答案',
      explain: `答案是${fq.a}`,
      category: '因数倍数',
      grade: 5, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 仓库问题 - 甲乙仓库调运
  for (let i = 0; i < 3; i++) {
    const diff = rand(20, 60)
    const transfer = rand(10, 30)
    const afterA = diff / 2 + transfer
    const afterB = diff / 2 - transfer + diff
    const totalA = afterA + transfer
    const totalB = afterB - transfer

    questions.push({
      prompt: `甲仓库比乙仓库多${diff}吨货物，从甲仓库运${transfer}吨到乙仓库后，甲仓库比乙仓库多多少吨？`,
      answer: String(diff - transfer * 2),
      hint: '甲减少2倍运走的，乙增加2倍运来的',
      explain: `${diff} - ${transfer}×2 = ${diff - transfer * 2}吨`,
      category: '仓库问题',
      grade: 5, type: 'application', difficulty: 3, points: 20,
      funFact: '调运问题的关键：运走的要算两次！'
    })
  }

  // 装箱问题
  for (let i = 0; i < 3; i++) {
    const smallBox = rand(8, 15)
    const largeBox = smallBox + rand(4, 10)
    const smallCount = rand(10, 20)
    const largeCount = rand(5, 15)
    const total = smallBox * smallCount + largeBox * largeCount

    questions.push({
      prompt: `小箱能装${smallBox}个，大箱能装${largeBox}个，有${total}个物品，用了${smallCount}个小箱，还需要几个大箱？`,
      answer: String(largeCount),
      hint: '先算小箱装了多少，再算大箱需要装多少',
      explain: `剩余 ${total}-${smallBox}×${smallCount}=${total-smallBox*smallCount}个，需要 ${total-smallBox*smallCount}÷${largeBox}=${largeCount}个大箱`,
      category: '装箱问题',
      grade: 5, type: 'application', difficulty: 2, points: 15
    })
  }

  // 还原问题
  for (let i = 0; i < 2; i++) {
    const original = rand(20, 50)
    const mult = rand(2, 4)
    const add = rand(5, 15)
    const result = original * mult + add

    questions.push({
      prompt: `一个数乘${mult}再加${add}得${result}，这个数是多少？`,
      answer: String(original),
      hint: '逆运算：先减后除',
      explain: `(${result} - ${add}) ÷ ${mult} = ${original}`,
      category: '还原问题',
      grade: 5, type: 'application', difficulty: 2, points: 15
    })
  }

  // 流水行船问题
  for (let i = 0; i < 2; i++) {
    const shipSpeed = rand(15, 25)
    const waterSpeed = rand(3, 8)
    const distance = (shipSpeed + waterSpeed) * rand(2, 4)
    const downTime = distance / (shipSpeed + waterSpeed)
    const upTime = distance / (shipSpeed - waterSpeed)

    questions.push({
      prompt: `船在静水中速度${shipSpeed}千米/时，水流速度${waterSpeed}千米/时，顺水航行${distance}千米需要几小时？`,
      answer: String(downTime),
      hint: '顺水速度 = 船速 + 水速',
      explain: `顺水速度 = ${shipSpeed}+${waterSpeed}=${shipSpeed+waterSpeed}，时间 = ${distance}÷${shipSpeed+waterSpeed}=${downTime}小时`,
      category: '流水问题',
      grade: 5, type: 'application', difficulty: 3, points: 20,
      funFact: '顺水加速，逆水减速！'
    })
  }

  // 平均数问题
  for (let i = 0; i < 2; i++) {
    const n1 = rand(3, 5)
    const avg1 = rand(80, 90)
    const n2 = rand(2, 4)
    const avg2 = rand(70, 85)
    const totalAvg = Math.round((n1 * avg1 + n2 * avg2) / (n1 + n2))

    questions.push({
      prompt: `${n1}个人平均分${avg1}分，${n2}个人平均分${avg2}分，这${n1+n2}个人平均分多少？`,
      answer: String(totalAvg),
      hint: '总分÷总人数',
      explain: `(${n1}×${avg1} + ${n2}×${avg2}) ÷ ${n1+n2} = ${totalAvg}分`,
      category: '平均数',
      grade: 5, type: 'application', difficulty: 2, points: 15
    })
  }

  // 集合问题 - 容斥原理
  for (let i = 0; i < 3; i++) {
    const total = rand(40, 60)
    const groupA = rand(25, 35)
    const groupB = rand(20, 30)
    const both = groupA + groupB - total
    const neither = 0

    questions.push({
      prompt: `班上${total}人，参加唱歌的有${groupA}人，参加跳舞的有${groupB}人，每人至少参加一项。既唱歌又跳舞的有多少人？`,
      answer: String(both),
      hint: '容斥原理：A∪B = A + B - A∩B',
      explain: `${groupA} + ${groupB} - ${total} = ${both}人`,
      category: '集合问题',
      grade: 5, type: 'logic', difficulty: 3, points: 20,
      funFact: '这就是容斥原理！'
    })
  }

  // 彩球问题 - 三元一次
  for (let i = 0; i < 2; i++) {
    const red = rand(8, 15)
    const yellow = rand(8, 15)
    const white = rand(6, 12)
    const redYellow = red + yellow
    const yellowWhite = yellow + white
    const redWhite = red + white

    questions.push({
      prompt: `红黄球共${redYellow}个，黄白球共${yellowWhite}个，红白球共${redWhite}个。红黄白各几个？`,
      answer: `${red}、${yellow}、${white}`,
      hint: '三式相加除以2得总数',
      explain: `总数=(${redYellow}+${yellowWhite}+${redWhite})÷2=${red+yellow+white}，红=${red+yellow+white}-${yellowWhite}=${red}...`,
      category: '集合问题',
      grade: 5, type: 'logic', difficulty: 3, points: 25
    })
  }

  // 知识竞赛评分
  for (let i = 0; i < 2; i++) {
    const total = 20
    const correct = rand(15, 18)
    const wrong = rand(1, 3)
    const notAnswered = total - correct - wrong
    const rightScore = 5
    const wrongScore = -3
    const score = correct * rightScore + wrong * wrongScore

    questions.push({
      prompt: `知识竞赛共${total}题，答对得${rightScore}分，答错扣${-wrongScore}分，不答不得分。小明得${score}分，答对几题？`,
      answer: String(correct),
      hint: '设答对x题，用得分列方程',
      explain: `答对${correct}题得${correct*rightScore}分，答错${wrong}题扣${wrong*(-wrongScore)}分，共${score}分`,
      category: '竞赛评分',
      grade: 5, type: 'application', difficulty: 3, points: 20
    })
  }

  // 火车过桥问题
  for (let i = 0; i < 2; i++) {
    const trainLength = rand(100, 300)
    const bridgeLength = rand(400, 800)
    const speed = rand(15, 25)
    const totalDist = trainLength + bridgeLength
    const time = totalDist / speed

    questions.push({
      prompt: `一列火车长${trainLength}米，以每秒${speed}米的速度通过${bridgeLength}米的大桥，需要多少秒？`,
      answer: String(time),
      hint: '路程 = 车长 + 桥长',
      explain: `(${trainLength}+${bridgeLength})÷${speed}=${time}秒`,
      category: '火车过桥',
      grade: 5, type: 'application', difficulty: 3, points: 20
    })
  }

  // 环形跑道问题
  for (let i = 0; i < 2; i++) {
    const track = rand(300, 500)
    const speedA = rand(150, 200)
    const speedB = rand(100, 140)
    const meetTime = track / (speedA + speedB)

    questions.push({
      prompt: `环形跑道周长${track}米，甲乙同时从同一点出发背向而跑，甲每分钟${speedA}米，乙每分钟${speedB}米，几分钟后首次相遇？`,
      answer: String(meetTime.toFixed(1)).replace(/\.0$/, ''),
      hint: '背向跑速度相加',
      explain: `${track} ÷ (${speedA}+${speedB}) = ${meetTime.toFixed(1)}分钟`,
      category: '环形跑道',
      grade: 5, type: 'application', difficulty: 3, points: 20
    })
  }

  // 利润问题
  for (let i = 0; i < 2; i++) {
    const cost = rand(50, 100)
    const profitRate = rand(20, 40)
    const sellPrice = cost * (1 + profitRate / 100)
    const profit = sellPrice - cost

    questions.push({
      prompt: `一件商品进价${cost}元，按${profitRate}%的利润定价，售价是多少元？`,
      answer: String(sellPrice),
      hint: '售价 = 进价 × (1 + 利润率)',
      explain: `${cost} × (1 + ${profitRate}%) = ${sellPrice}元`,
      category: '利润问题',
      grade: 5, type: 'application', difficulty: 2, points: 15
    })
  }

  return shuffle(questions)
}

// ==================== 六年级题目 ====================
function generateGrade6Questions(): Question[] {
  const questions: Question[] = []

  // 分数乘除法
  for (let i = 0; i < 4; i++) {
    const n1 = rand(1, 5)
    const d1 = rand(n1 + 1, 8)
    const n2 = rand(1, 5)
    const d2 = rand(n2 + 1, 8)

    const resN = n1 * n2
    const resD = d1 * d2
    const gcd = getGCD(resN, resD)

    questions.push({
      prompt: `${n1}/${d1} × ${n2}/${d2} = ?`,
      answer: resD/gcd === 1 ? String(resN/gcd) : `${resN/gcd}/${resD/gcd}`,
      hint: '分子乘分子，分母乘分母',
      explain: `结果约分后是 ${resN/gcd}/${resD/gcd}`,
      category: '分数乘法',
      grade: 6, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 百分数应用
  for (let i = 0; i < 4; i++) {
    const type = rand(1, 3)
    const name = pick(names)

    if (type === 1) { // 求百分之几是多少
      const total = rand(5, 20) * 10
      const percent = pick([10, 20, 25, 40, 50])
      const part = total * percent / 100
      questions.push({
        prompt: `${name}有${total}元，花了${percent}%，花了多少元？`,
        answer: String(part),
        hint: '部分 = 总数 × 百分率',
        explain: `${total} × ${percent}% = ${part}元`,
        category: '百分数应用',
        grade: 6, type: 'application', difficulty: 2, points: 15
      })
    } else if (type === 2) { // 求一个数是另一个数的百分之几 - 确保结果是整数
      const percent = pick([10, 20, 25, 30, 40, 50, 60, 75, 80])
      const b = rand(4, 10) * 10  // 总数
      const a = b * percent / 100  // 部分
      questions.push({
        prompt: `${a}是${b}的百分之几？`,
        answer: String(percent),
        hint: '百分率 = 部分 ÷ 总数 × 100%',
        explain: `${a} ÷ ${b} × 100% = ${percent}%`,
        category: '百分数应用',
        grade: 6, type: 'application', difficulty: 2, points: 15
      })
    } else { // 已知部分和百分率求总数
      const percent = pick([20, 25, 40, 50])
      const part = rand(2, 10) * 10
      const total = part * 100 / percent
      questions.push({
        prompt: `${name}看了一本书的${percent}%，是${part}页，这本书共多少页？`,
        answer: String(total),
        hint: '总数 = 部分 ÷ 百分率',
        explain: `${part} ÷ ${percent}% = ${total}页`,
        category: '百分数应用',
        grade: 6, type: 'application', difficulty: 3, points: 20
      })
    }
  }

  // 比和比例
  for (let i = 0; i < 4; i++) {
    const a = rand(12, 36)
    const b = rand(8, 30)
    const gcd = getGCD(a, b)
    questions.push({
      prompt: `化简比 ${a}:${b}`,
      answer: `${a/gcd}:${b/gcd}`,
      hint: '同时除以最大公因数',
      explain: `${a}:${b} = ${a/gcd}:${b/gcd}`,
      category: '比和比例',
      grade: 6, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 圆的周长和面积
  for (let i = 0; i < 3; i++) {
    const r = rand(3, 10)
    const circumference = (2 * 3.14 * r).toFixed(2)
    const area = (3.14 * r * r).toFixed(2)

    const isCircum = rand(0, 1)
    if (isCircum) {
      questions.push({
        prompt: `圆的半径是${r}厘米，周长是多少厘米？(π取3.14)`,
        answer: circumference.replace(/\.?0+$/, ''),
        hint: '周长 = 2πr',
        explain: `2 × 3.14 × ${r} = ${circumference}厘米`,
        category: '圆的周长',
        grade: 6, type: 'geometry', difficulty: 2, points: 15
      })
    } else {
      questions.push({
        prompt: `圆的半径是${r}厘米，面积是多少平方厘米？(π取3.14)`,
        answer: area.replace(/\.?0+$/, ''),
        hint: '面积 = πr²',
        explain: `3.14 × ${r}² = ${area}平方厘米`,
        category: '圆的面积',
        grade: 6, type: 'geometry', difficulty: 2, points: 15
      })
    }
  }

  // 比例尺问题
  for (let i = 0; i < 3; i++) {
    const mapDist = rand(2, 8)
    const scale = pick([1000, 5000, 10000, 50000])
    const realDist = mapDist * scale
    questions.push({
      prompt: `比例尺1:${scale}的地图上，${mapDist}厘米代表实际多少厘米？`,
      answer: String(realDist),
      hint: '实际距离 = 图上距离 × 比例尺分母',
      explain: `${mapDist} × ${scale} = ${realDist}厘米`,
      category: '比例尺',
      grade: 6, type: 'application', difficulty: 2, points: 15
    })
  }

  // 利润问题
  for (let i = 0; i < 3; i++) {
    const cost = rand(50, 200)
    const profitRate = pick([10, 20, 25, 30, 50])
    const profit = cost * profitRate / 100
    const sellPrice = cost + profit
    questions.push({
      prompt: `一件商品成本${cost}元，利润率${profitRate}%，售价是多少元？`,
      answer: String(sellPrice),
      hint: '售价 = 成本 + 成本×利润率',
      explain: `${cost} + ${cost}×${profitRate}% = ${sellPrice}元`,
      category: '利润问题',
      grade: 6, type: 'application', difficulty: 3, points: 20,
      funFact: '利润率越高，商家赚得越多！'
    })
  }

  // 负数运算
  const negativeQuestions = [
    { q: '-8 + 5 = ?', a: '-3' },
    { q: '6 - 10 = ?', a: '-4' },
    { q: '-3 + (-2) = ?', a: '-5' },
    { q: '-7 - (-3) = ?', a: '-4' },
    { q: '(-4) × 3 = ?', a: '-12' }
  ]
  for (const nq of negativeQuestions) {
    questions.push({
      prompt: nq.q,
      answer: nq.a,
      hint: '负数运算注意符号',
      explain: `${nq.q.replace('?', nq.a)}`,
      category: '负数运算',
      grade: 6, type: 'calculation', difficulty: 2, points: 15
    })
  }

  // 圆柱体积
  for (let i = 0; i < 2; i++) {
    const r = rand(2, 5)
    const h = rand(4, 10)
    const volume = (3.14 * r * r * h).toFixed(2)
    questions.push({
      prompt: `圆柱底面半径${r}厘米，高${h}厘米，体积是多少立方厘米？(π取3.14)`,
      answer: volume.replace(/\.?0+$/, ''),
      hint: '体积 = πr²h',
      explain: `3.14 × ${r}² × ${h} = ${volume}立方厘米`,
      category: '圆柱体积',
      grade: 6, type: 'geometry', difficulty: 3, points: 20
    })
  }

  // 浓度问题
  for (let i = 0; i < 3; i++) {
    const saltPercent = pick([5, 8, 10, 12, 15, 20])
    const waterWeight = rand(100, 500)
    const saltWeight = waterWeight * saltPercent / (100 - saltPercent)
    const totalWeight = waterWeight + saltWeight

    questions.push({
      prompt: `用${Math.round(saltWeight)}克盐和${waterWeight}克水配制盐水，浓度是百分之几？`,
      answer: String(saltPercent),
      hint: '浓度 = 盐 ÷ (盐+水) × 100%',
      explain: `${Math.round(saltWeight)} ÷ ${Math.round(totalWeight)} × 100% = ${saltPercent}%`,
      category: '浓度问题',
      grade: 6, type: 'application', difficulty: 3, points: 20
    })
  }

  // 往返行程问题
  for (let i = 0; i < 2; i++) {
    const distanceOne = rand(30, 80)
    const speedGo = rand(30, 50)
    const speedBack = rand(20, speedGo - 5)
    const timeGo = distanceOne / speedGo
    const timeBack = distanceOne / speedBack
    const avgSpeed = (distanceOne * 2) / (timeGo + timeBack)

    questions.push({
      prompt: `从甲地到乙地${distanceOne}千米，去时速度${speedGo}千米/时，回时速度${speedBack}千米/时，往返平均速度是多少？`,
      answer: String(Math.round(avgSpeed)),
      hint: '平均速度 = 总路程 ÷ 总时间',
      explain: `总路程${distanceOne*2}千米，总时间${timeGo}+${timeBack}=${timeGo+timeBack}小时，平均速度≈${Math.round(avgSpeed)}千米/时`,
      category: '往返问题',
      grade: 6, type: 'application', difficulty: 3, points: 20,
      funFact: '往返平均速度不是两个速度的平均数！'
    })
  }

  // 比例分配问题
  for (let i = 0; i < 3; i++) {
    const ratio1 = rand(2, 5)
    const ratio2 = rand(2, 5)
    const unit = rand(10, 30)
    const total = (ratio1 + ratio2) * unit
    const part1 = ratio1 * unit
    const part2 = ratio2 * unit

    questions.push({
      prompt: `把${total}元按${ratio1}:${ratio2}分配，较多的一份是多少元？`,
      answer: String(Math.max(part1, part2)),
      hint: '先求一份是多少',
      explain: `一份=${total}÷${ratio1+ratio2}=${unit}元，${Math.max(ratio1,ratio2)}份=${Math.max(part1,part2)}元`,
      category: '比例分配',
      grade: 6, type: 'application', difficulty: 2, points: 15
    })
  }

  // 工程接力问题
  for (let i = 0; i < 2; i++) {
    const daysA = rand(6, 12)
    const daysB = rand(8, 15)
    const daysAWork = rand(2, 4)
    const workA = daysAWork / daysA
    const remainWork = 1 - workA
    const daysBWork = remainWork * daysB

    questions.push({
      prompt: `一项工程甲单独做${daysA}天完成，乙单独做${daysB}天完成。甲先做${daysAWork}天，剩下的乙做，乙还要做几天？`,
      answer: String(Math.round(daysBWork)),
      hint: '先算甲做了多少，再算乙要做的',
      explain: `甲做了${daysAWork}/${daysA}，剩${Math.round(remainWork*100)/100}，乙需${Math.round(daysBWork)}天`,
      category: '工程接力',
      grade: 6, type: 'application', difficulty: 3, points: 20
    })
  }

  // 数字规律问题
  for (let i = 0; i < 2; i++) {
    const start = rand(1, 5)
    const diff = rand(2, 5)
    const n = rand(10, 20)
    const nthTerm = start + (n - 1) * diff

    questions.push({
      prompt: `数列${start}, ${start+diff}, ${start+2*diff}, ${start+3*diff}...的第${n}项是多少？`,
      answer: String(nthTerm),
      hint: '等差数列：第n项 = 首项 + (n-1)×公差',
      explain: `${start} + (${n}-1)×${diff} = ${nthTerm}`,
      category: '数列规律',
      grade: 6, type: 'logic', difficulty: 3, points: 20
    })
  }

  // 抽屉原理
  for (let i = 0; i < 2; i++) {
    const drawers = rand(3, 6)
    const items = drawers + 1

    questions.push({
      prompt: `把${items}个球放入${drawers}个盒子，至少有一个盒子有几个球？`,
      answer: '2',
      hint: '抽屉原理：物品数 > 抽屉数，必有一个抽屉至少2个',
      explain: `${items} > ${drawers}，所以至少有一个盒子有2个球`,
      category: '抽屉原理',
      grade: 6, type: 'logic', difficulty: 2, points: 15,
      funFact: '抽屉原理又叫鸽巢原理！'
    })
  }

  return shuffle(questions)
}

// 求最大公约数
function getGCD(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

// 生成指定年级的题目
export function generateQuestionsByGrade(grade: Grade, count: number): Question[] {
  let allQuestions: Question[]

  switch (grade) {
    case 1: allQuestions = generateGrade1Questions(); break
    case 2: allQuestions = generateGrade2Questions(); break
    case 3: allQuestions = generateGrade3Questions(); break
    case 4: allQuestions = generateGrade4Questions(); break
    case 5: allQuestions = generateGrade5Questions(); break
    case 6: allQuestions = generateGrade6Questions(); break
    default: allQuestions = generateGrade1Questions()
  }

  // 确保题目够用
  while (allQuestions.length < count) {
    let more: Question[]
    switch (grade) {
      case 1: more = generateGrade1Questions(); break
      case 2: more = generateGrade2Questions(); break
      case 3: more = generateGrade3Questions(); break
      case 4: more = generateGrade4Questions(); break
      case 5: more = generateGrade5Questions(); break
      case 6: more = generateGrade6Questions(); break
      default: more = generateGrade1Questions()
    }
    allQuestions.push(...more)
  }

  return shuffle(allQuestions).slice(0, count)
}

// 兼容旧接口
export function generateQuestions(difficulty: Difficulty, count: number): Question[] {
  let grade: Grade
  switch (difficulty) {
    case 'easy': grade = pick([1, 2]) as Grade; break
    case 'medium': grade = pick([3, 4]) as Grade; break
    case 'hard': grade = pick([5, 6]) as Grade; break
    default: grade = 1
  }
  return generateQuestionsByGrade(grade, count)
}

// 验证答案
export function validateAnswer(question: Question, userAnswer: string): boolean {
  const normalize = (ans: string) => {
    return ans.toLowerCase().trim()
      .replace(/\s+/g, '')
      .replace(/：/g, ':')
      .replace(/\.0+$/, '')
      .replace(/又/g, ' ')
  }

  const normalized = normalize(userAnswer)

  if (Array.isArray(question.answer)) {
    return question.answer.some(a => normalize(a) === normalized)
  }

  return normalize(question.answer) === normalized
}
