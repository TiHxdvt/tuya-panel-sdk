#!/bin/bash
# 修复 rn-harmony-pack 转换后的鸿蒙工程
# 用法: 在项目根目录执行 ./fix-harmony.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FIX_DIR="$SCRIPT_DIR/harmony-fix"
HO_DIR="$SCRIPT_DIR/example_HO"

if [ ! -d "$HO_DIR" ]; then
  echo "错误: $HO_DIR 不存在，请先运行 rn-harmony-pack 转换"
  exit 1
fi

echo "==> 1. 覆盖配置文件..."
cp "$FIX_DIR/package.json"          "$HO_DIR/package.json"
cp "$FIX_DIR/index.harmony.js"      "$HO_DIR/index.harmony.js"
cp "$FIX_DIR/babel.config.js"       "$HO_DIR/babel.config.js"
cp "$FIX_DIR/metro.config.js"       "$HO_DIR/metro.config.js"

echo "==> 2. 覆盖 src 文件..."
cp "$FIX_DIR/src/main.js"                     "$HO_DIR/src/main.js"
cp "$FIX_DIR/src/config/routers.js"           "$HO_DIR/src/config/routers.js"
cp "$FIX_DIR/src/redux/modules/common.js"     "$HO_DIR/src/redux/modules/common.js"
cp "$FIX_DIR/src/redux/configureStore.js"     "$HO_DIR/src/redux/configureStore.js"

echo "==> 3. 复制 patches..."
rm -rf "$HO_DIR/patches"
cp -R "$FIX_DIR/patches" "$HO_DIR/patches"

echo "==> 4. 复制 stubs..."
rm -rf "$HO_DIR/stubs"
cp -R "$FIX_DIR/stubs" "$HO_DIR/stubs"

echo "==> 5. 删除残留的 packages/node_modules 软链接..."
rm -f "$SCRIPT_DIR/packages/node_modules"

echo "==> 6. 安装依赖 (含 patch 自动应用)..."
cd "$HO_DIR"
yarn install

echo ""
echo "修复完成! 现在可以运行:"
echo "  cd example_HO && yarn start --reset-cache"
