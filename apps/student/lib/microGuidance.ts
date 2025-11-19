const table: Record<string, string> = {
  journey_same_speed: "小车小贴士：速度一样就追不上哦，试着调快或调慢一个！",
  journey_past: "小车小贴士：这次相遇发生在过去，换个方向再出发吧！",
  scale_unbalanced: "实验助手：左右不一样重，试试给轻的一边再加一个小石子！",
  scale_balanced: "太棒啦！现在把平衡写成‘左=右’的小等式。",
  area_invalid: "地垫还没展开好，长或宽不能为0，先把数值改得合理些。",
  area_ok: "观察发现：面积=长×宽。把长或宽翻倍看看面积会怎样变。",
  prob_sum_not_one: "树形图提示：每层的分支加起来要刚好是1，调整到满格吧！",
  prob_ok: "做得好！读出每条路径的可能性，再试试换另一个比例。",
  words_incorrect: "把词语放进小句子试试，读一读是不是贴合场景。",
  words_correct: "赞！请你用这个词造一个可爱的句子。"
}

export function guidanceFor(code: string) {
  return table[code] || "继续尝试，观察图形与数值的关系。"
}
table["journey_ok"] = "棒棒！读出相遇的时间与位置，再试一次速度变化。"
table["ratio_ok"] = "写下 B=k·A 的小等式，再把 k 或 A 调一调看变化。"
table["ratio_invalid"] = "倍数要是正数，A也不能是0哦，先改成合理的数。"
table["error_ok"] = "把少算的那一部分加回去，就能得到正确的和。"
table["error_check"] = "看清楚是哪个位看错了，用对应的位值来补回。"
table["carry_explain"] = "当这一列的和≥10，就向左边送一个‘十’，在上方写个小1表示进位。"
table["borrow_explain"] = "这一位不够减时，从左边借一个‘十’，这里先加10再计算。"
table["lcm_explain"] = "先把分母细分到同样的份数（LCM），分数大小不变，更容易加减。"
table["gcd_explain"] = "分子和分母同时除以最大公因数（GCD），就得到最简分数。"