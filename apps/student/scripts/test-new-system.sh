#!/bin/bash

# 课程分类系统 - 测试验证脚本
# 在启用新系统前运行此脚本进行全面检查

set -e

echo "🧪 课程分类系统 - 测试验证"
echo "================================"
echo ""

# 检查当前目录
if [ ! -f "package.json" ]; then
  echo "❌ 错误：请在 apps/student 目录下运行此脚本"
  exit 1
fi

PASS=0
FAIL=0
WARN=0

# 测试函数
test_file() {
  local file=$1
  local desc=$2

  if [ -f "$file" ]; then
    echo "   ✅ $desc"
    ((PASS++))
  else
    echo "   ❌ $desc - 文件不存在"
    ((FAIL++))
  fi
}

test_import() {
  local file=$1
  local pattern=$2
  local desc=$3

  if grep -q "$pattern" "$file" 2>/dev/null; then
    echo "   ✅ $desc"
    ((PASS++))
  else
    echo "   ⚠️  $desc - 未找到导入"
    ((WARN++))
  fi
}

echo "1️⃣ 检查新文件是否存在..."
test_file "lib/catalog-new.ts" "catalog-new.ts"
test_file "app/page-new.tsx" "page-new.tsx"
test_file "app/math-new/page.tsx" "math-new/page.tsx"
test_file "app/grade/[id]/page.tsx" "grade/[id]/page.tsx"
test_file "app/category/[id]/page.tsx" "category/[id]/page.tsx"
echo ""

echo "2️⃣ 检查文档是否完整..."
test_file "docs/navigation-analysis.md" "导航分析文档"
test_file "docs/migration-guide.md" "迁移指南"
test_file "docs/refactor-summary.md" "重构总结"
test_file "docs/quick-preview.md" "快速预览"
echo ""

echo "3️⃣ 检查新catalog数据结构..."
if [ -f "lib/catalog-new.ts" ]; then
  # 检查关键导出
  test_import "lib/catalog-new.ts" "export interface LessonItem" "LessonItem 接口定义"
  test_import "lib/catalog-new.ts" "export const allLessons" "allLessons 数组"
  test_import "lib/catalog-new.ts" "export const categories" "categories 数组"
  test_import "lib/catalog-new.ts" "export function getLessonsByGrade" "getLessonsByGrade 函数"
  test_import "lib/catalog-new.ts" "export function getLessonsByCategory" "getLessonsByCategory 函数"
  test_import "lib/catalog-new.ts" "export function getFeaturedLessons" "getFeaturedLessons 函数"
fi
echo ""

echo "4️⃣ 检查新页面导入..."
if [ -f "app/page-new.tsx" ]; then
  test_import "app/page-new.tsx" "from.*catalog-new" "catalog-new 导入"
  test_import "app/page-new.tsx" "getFeaturedLessons" "getFeaturedLessons 使用"
  test_import "app/page-new.tsx" "getPopularLessons" "getPopularLessons 使用"
fi

if [ -f "app/grade/\[id\]/page.tsx" ]; then
  test_import "app/grade/[id]/page.tsx" "from.*catalog-new" "catalog-new 导入"
  test_import "app/grade/[id]/page.tsx" "getLessonsByGrade" "getLessonsByGrade 使用"
fi
echo ""

echo "5️⃣ TypeScript 语法检查..."
if command -v npx &> /dev/null; then
  echo "   正在检查 TypeScript 类型..."

  # 只检查新文件的类型错误
  ERROR_COUNT=$(npx tsc --noEmit 2>&1 | grep -E "(catalog-new|page-new|grade/\[id\]|category/\[id\]|math-new)" | grep "error TS" | wc -l | tr -d ' ')

  if [ "$ERROR_COUNT" -eq 0 ]; then
    echo "   ✅ TypeScript 类型检查通过（新文件）"
    ((PASS++))
  else
    echo "   ❌ TypeScript 类型错误: $ERROR_COUNT 个"
    ((FAIL++))
  fi
else
  echo "   ⚠️  未安装 TypeScript，跳过类型检查"
  ((WARN++))
fi
echo ""

echo "6️⃣ 检查课程数据完整性..."
if [ -f "lib/catalog-new.ts" ]; then
  # 统计课程数量
  LESSON_COUNT=$(grep -c "href: \"/lessons/" lib/catalog-new.ts || echo 0)
  echo "   📊 检测到 $LESSON_COUNT 个课程"

  if [ "$LESSON_COUNT" -ge 50 ]; then
    echo "   ✅ 课程数量充足 (>= 50)"
    ((PASS++))
  else
    echo "   ⚠️  课程数量较少 (< 50)"
    ((WARN++))
  fi

  # 检查必需字段
  if grep -q "gradeLevel:" lib/catalog-new.ts; then
    echo "   ✅ 包含年级字段"
    ((PASS++))
  else
    echo "   ❌ 缺少年级字段"
    ((FAIL++))
  fi

  if grep -q "difficulty:" lib/catalog-new.ts; then
    echo "   ✅ 包含难度字段"
    ((PASS++))
  else
    echo "   ❌ 缺少难度字段"
    ((FAIL++))
  fi

  if grep -q "category:" lib/catalog-new.ts; then
    echo "   ✅ 包含分类字段"
    ((PASS++))
  else
    echo "   ❌ 缺少分类字段"
    ((FAIL++))
  fi
fi
echo ""

echo "7️⃣ 检查启用脚本..."
test_file "scripts/enable-new-system.sh" "启用脚本"
if [ -f "scripts/enable-new-system.sh" ]; then
  if [ -x "scripts/enable-new-system.sh" ]; then
    echo "   ✅ 启用脚本有执行权限"
    ((PASS++))
  else
    echo "   ⚠️  启用脚本无执行权限（可运行 chmod +x）"
    ((WARN++))
  fi
fi
echo ""

# 生成测试报告
echo "================================"
echo "📊 测试报告"
echo "================================"
echo "✅ 通过: $PASS"
echo "❌ 失败: $FAIL"
echo "⚠️  警告: $WARN"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 所有关键测试通过！"
  echo ""
  echo "✨ 建议下一步："
  echo "  1. 启动开发服务器: npm run dev"
  echo "  2. 手动测试新页面:"
  echo "     - http://localhost:3002/grade/1"
  echo "     - http://localhost:3002/grade/3"
  echo "     - http://localhost:3002/category/数与运算"
  echo "  3. 如果测试正常，运行: ./scripts/enable-new-system.sh"
  echo ""
  exit 0
else
  echo "❌ 存在 $FAIL 个失败项，请先修复！"
  echo ""
  exit 1
fi
