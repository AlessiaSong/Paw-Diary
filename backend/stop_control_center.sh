#!/bin/bash
# 停止占用5000端口的ControlCenter服务

echo "🔍 检查端口5000占用情况..."
lsof -i :5000

echo ""
echo "🛑 尝试停止ControlCenter服务..."
echo "注意: 这可能需要管理员权限"

# 尝试停止ControlCenter
sudo pkill -f "ControlCenter" 2>/dev/null || echo "无法停止ControlCenter"

echo ""
echo "⏳ 等待服务停止..."
sleep 3

echo ""
echo "🔍 再次检查端口5000..."
lsof -i :5000

echo ""
echo "✅ 如果端口5000已释放，现在可以启动后端服务了"
echo "启动命令: python main.py" 