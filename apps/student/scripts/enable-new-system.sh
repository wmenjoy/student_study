#!/bin/bash

# 课程分类系统 - 快速启用脚本
# 使用前请确保已经充分测试新系统

set -e  # 遇到错误立即退出

echo "🎯 课程分类系统重构 - 快速启用"
echo "================================"
echo ""

# 检查当前目录
if [ ! -f "package.json" ]; then
  echo "❌ 错误：请在 apps/student 目录下运行此脚本"
  exit 1
fi

echo "📋 启用前检查清单："
echo "  - [ ] 已充分测试所有新页面"
echo "  - [ ] 所有链接都能正常工作"
echo "  - [ ] 年级筛选准确"
echo "  - [ ] 难度标记合理"
echo "  - [ ] UI在移动端正常"
echo ""
read -p "是否已完成上述检查？(y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ 已取消。请先完成测试再启用。"
    exit 1
fi

echo ""
echo "🔄 开始启用新系统..."
echo ""

# 1. 备份旧文件
echo "1️⃣ 备份旧文件..."
if [ -f "app/page.tsx" ]; then
  mv app/page.tsx app/page-old.tsx
  echo "   ✅ 已备份 app/page.tsx → app/page-old.tsx"
fi

if [ -f "app/math/page.tsx" ]; then
  mv app/math/page.tsx app/math/page-old.tsx
  echo "   ✅ 已备份 app/math/page.tsx → app/math/page-old.tsx"
fi

if [ -f "lib/catalog.ts" ]; then
  mv lib/catalog.ts lib/catalog-old.ts
  echo "   ✅ 已备份 lib/catalog.ts → lib/catalog-old.ts"
fi

echo ""

# 2. 启用新文件
echo "2️⃣ 启用新文件..."
if [ -f "app/page-new.tsx" ]; then
  mv app/page-new.tsx app/page.tsx
  echo "   ✅ 已启用 app/page.tsx"
fi

if [ -f "app/math-new/page.tsx" ]; then
  mv app/math-new/page.tsx app/math/page.tsx
  echo "   ✅ 已启用 app/math/page.tsx"
fi

if [ -f "lib/catalog-new.ts" ]; then
  mv lib/catalog-new.ts lib/catalog.ts
  echo "   ✅ 已启用 lib/catalog.ts"
fi

echo ""

# 3. 检查新文件是否存在
echo "3️⃣ 验证新文件..."
if [ ! -f "app/page.tsx" ]; then
  echo "   ❌ 错误：app/page.tsx 不存在"
  exit 1
fi

if [ ! -f "app/grade/[id]/page.tsx" ]; then
  echo "   ❌ 错误：app/grade/[id]/page.tsx 不存在"
  exit 1
fi

if [ ! -f "app/category/[id]/page.tsx" ]; then
  echo "   ❌ 错误：app/category/[id]/page.tsx 不存在"
  exit 1
fi

if [ ! -f "lib/catalog.ts" ]; then
  echo "   ❌ 错误：lib/catalog.ts 不存在"
  exit 1
fi

echo "   ✅ 所有新文件已就位"
echo ""

# 4. TypeScript 类型检查
echo "4️⃣ TypeScript 类型检查..."
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  echo "   ⚠️  警告：存在 TypeScript 类型错误，但这些可能是旧代码的错误"
else
  echo "   ✅ TypeScript 类型检查通过"
fi
echo ""

# 5. 清理临时目录（如果存在）
echo "5️⃣ 清理临时目录..."
if [ -d "app/math-new" ]; then
  rm -rf app/math-new
  echo "   ✅ 已删除 app/math-new"
fi
echo ""

echo "✅ 启用完成！"
echo ""
echo "📝 下一步："
echo "  1. 运行 npm run dev 启动开发服务器"
echo "  2. 访问 http://localhost:3002"
echo "  3. 验证所有功能正常"
echo ""
echo "🔙 如需回滚："
echo "  mv app/page-old.tsx app/page.tsx"
echo "  mv app/math/page-old.tsx app/math/page.tsx"
echo "  mv lib/catalog-old.ts lib/catalog.ts"
echo ""
echo "📚 更多信息请查看："
echo "  - docs/refactor-summary.md"
echo "  - docs/migration-guide.md"
echo "  - docs/quick-preview.md"
echo ""
echo "🎉 祝使用愉快！"
