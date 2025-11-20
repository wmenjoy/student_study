# AI 智能出题功能使用指南

## 功能介绍

AI 智能出题功能使用本地 Ollama AI 模型，根据您选择的年级、题型和难度，智能生成个性化的数学应用题。

## 前置条件

### 1. 安装 Ollama

访问 [ollama.ai](https://ollama.ai) 下载并安装 Ollama（支持 macOS、Linux、Windows）

### 2. 启动 Ollama 服务

安装后，Ollama 会自动在后台运行。如果未运行，可以手动启动：

```bash
ollama serve
```

默认会在 `http://localhost:11434` 启动服务。

### 3. 下载 AI 模型

推荐使用以下模型（按质量排序）：

```bash
# 推荐：Qwen2.5 7B（中文数学能力强）
ollama pull qwen2.5:7b

# 备选：Qwen2.5 14B（质量更高，需要更多资源）
ollama pull qwen2.5:14b

# 备选：Llama3（英文为主）
ollama pull llama3:8b

# 轻量级：Qwen2.5 3B（低配置电脑）
ollama pull qwen2.5:3b
```

## 使用方法

### 1. 访问 AI 出题页面

打开浏览器访问：
```
http://localhost:3000/lessons/ai-generator
```

### 2. 选择出题参数

- **AI 模型**：选择已下载的模型（推荐 qwen2.5:7b）
- **年级**：1-6年级
- **题型**：和差问题、行程问题、工程问题等
- **难度**：简单/中等/困难
- **题目数量**：1-10题

### 3. 生成题目

点击"🚀 生成题目"按钮，AI 会开始思考并生成题目。
- 生成时间：3-15秒（取决于模型大小和电脑性能）
- 生成后会显示第一道题目

### 4. 答题

- 在输入框中输入答案
- 点击"提交答案"或按 Enter 键
- 查看是否正确，以及详细解析
- 使用"上一题"/"下一题"切换题目

## 配置说明

### 环境变量（可选）

如果 Ollama 运行在非默认端口，可以在 `.env.local` 中配置：

```bash
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
```

### 模型选择建议

| 配置 | 推荐模型 | 说明 |
|------|---------|------|
| 高性能电脑（16GB+ 内存）| qwen2.5:14b | 质量最高 |
| 普通电脑（8GB+ 内存）| qwen2.5:7b | 平衡性能与质量 |
| 低配置电脑（4GB+ 内存）| qwen2.5:3b | 轻量快速 |

## 常见问题

### Q: 提示"Ollama 服务未启动"

**A**:
1. 确认已安装 Ollama
2. 运行 `ollama serve` 启动服务
3. 检查 `http://localhost:11434` 是否可访问

### Q: 生成的题目格式不对

**A**:
1. 使用 qwen2.5 系列模型（中文数学能力更强）
2. 尝试重新生成
3. 检查模型是否正确下载：`ollama list`

### Q: 生成速度很慢

**A**:
1. 使用更小的模型（如 qwen2.5:3b）
2. 减少题目数量
3. 检查电脑资源占用

### Q: 能否使用其他 AI 模型？

**A**: 可以！任何支持 Ollama 的模型都可以使用：
```bash
# 查看可用模型
ollama list

# 拉取其他模型
ollama pull <model-name>
```

## 技术架构

```
用户界面 (React)
    ↓
ollamaService.ts (API 服务)
    ↓
Ollama HTTP API (本地)
    ↓
AI 模型 (qwen2.5/llama3/etc)
```

### 核心文件

- `/lib/ollamaService.ts` - Ollama API 服务模块
- `/app/lessons/ai-generator/page.tsx` - AI 出题页面
- `/lib/catalog.ts` - 课程目录配置

## 优势

✅ **完全本地运行** - 数据不上传，隐私安全
✅ **离线可用** - 无需网络连接
✅ **个性化** - 根据年级和题型定制
✅ **免费** - 无需付费 API
✅ **可扩展** - 支持任何 Ollama 模型

## 未来改进方向

- [ ] 支持保存生成的题目
- [ ] 支持导出为 PDF
- [ ] 添加错题本功能
- [ ] 支持自定义提示词模板
- [ ] 添加题目质量评分
- [ ] 支持批量生成并筛选

## 反馈与建议

如有问题或建议，欢迎提交 Issue！
