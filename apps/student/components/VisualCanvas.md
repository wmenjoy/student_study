# VisualCanvas 组件使用说明

## 功能
VisualCanvas 是一个用于在 Canvas 上绘制图形的组件，主要用于数学题目的可视化展示。

## 支持的图形类型

### 1. 线段 (line)
```json
{
  "type": "line",
  "x1": 50,
  "y1": 100,
  "x2": 200,
  "y2": 100,
  "color": "#3b82f6"
}
```

### 2. 矩形 (rect)
```json
{
  "type": "rect",
  "x": 50,
  "y": 100,
  "width": 100,
  "height": 60,
  "color": "#93c5fd",
  "label": "小明"
}
```

### 3. 圆形 (circle)
```json
{
  "type": "circle",
  "x": 150,
  "y": 150,
  "radius": 40,
  "color": "#fcd34d",
  "label": "12个"
}
```

### 4. 文字 (text)
```json
{
  "type": "text",
  "x": 100,
  "y": 50,
  "text": "和差问题",
  "color": "#1e40af",
  "size": 16
}
```

### 5. 箭头 (arrow)
```json
{
  "type": "arrow",
  "x1": 150,
  "y1": 130,
  "x2": 250,
  "y2": 130,
  "color": "#dc2626"
}
```

## 完整示例

### 和差问题示例
```json
[
  {
    "type": "rect",
    "x": 50,
    "y": 100,
    "width": 120,
    "height": 50,
    "color": "#93c5fd",
    "label": "小明: 12个"
  },
  {
    "type": "rect",
    "x": 50,
    "y": 170,
    "width": 80,
    "height": 50,
    "color": "#fcd34d",
    "label": "小红: ?"
  },
  {
    "type": "line",
    "x1": 130,
    "y1": 195,
    "x2": 170,
    "y2": 195,
    "color": "#dc2626"
  },
  {
    "type": "text",
    "x": 150,
    "y": 185,
    "text": "少4个",
    "color": "#dc2626",
    "size": 12
  },
  {
    "type": "arrow",
    "x1": 200,
    "y1": 125,
    "x2": 200,
    "y2": 195,
    "color": "#059669"
  },
  {
    "type": "text",
    "x": 220,
    "y": 160,
    "text": "相差4个",
    "color": "#059669",
    "size": 14
  }
]
```

### 倍数问题示例
```json
[
  {
    "type": "rect",
    "x": 50,
    "y": 100,
    "width": 60,
    "height": 40,
    "color": "#93c5fd",
    "label": "1倍"
  },
  {
    "type": "rect",
    "x": 50,
    "y": 160,
    "width": 60,
    "height": 40,
    "color": "#fcd34d",
    "label": "1倍"
  },
  {
    "type": "rect",
    "x": 120,
    "y": 160,
    "width": 60,
    "height": 40,
    "color": "#fcd34d",
    "label": "1倍"
  },
  {
    "type": "rect",
    "x": 190,
    "y": 160,
    "width": 60,
    "height": 40,
    "color": "#fcd34d",
    "label": "1倍"
  },
  {
    "type": "text",
    "x": 80,
    "y": 80,
    "text": "小明",
    "color": "#1e40af",
    "size": 14
  },
  {
    "type": "text",
    "x": 80,
    "y": 220,
    "text": "小红（3倍）",
    "color": "#1e40af",
    "size": 14
  }
]
```

## 使用方法

```tsx
import { VisualCanvas } from '@/components/VisualCanvas'

// 在组件中使用
<VisualCanvas
  instructions={drawInstructions}
  width={600}
  height={400}
/>
```

## 注意事项

1. 坐标系原点在左上角
2. 所有尺寸单位为像素
3. 颜色使用十六进制格式（如 #3b82f6）
4. label 会自动显示在图形中心
5. 建议画布尺寸：600x400 或 550x350
