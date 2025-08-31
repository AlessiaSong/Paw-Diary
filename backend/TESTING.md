# Paw Diary API 测试指南

## 快速开始

### 1. 启动后端服务

```bash
cd backend
python main.py
```

确保看到类似输出：
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 2. 安装测试依赖

```bash
pip install -r requirements.txt
```

## 测试方法

### 方法1: 自动化测试 (推荐)

运行完整的API测试套件：

```bash
python test_api.py
```

这个脚本会：
- ✅ 测试用户管理功能
- ✅ 测试宠物管理功能  
- ✅ 测试饮食记录功能
- ✅ 测试体重记录功能
- ✅ 测试疫苗记录功能
- ✅ 测试提醒系统功能

### 方法2: 创建测试数据

生成测试数据来验证API功能：

```bash
python create_test_data.py
```

这个脚本会创建：
- 👤 测试用户
- 🐕 测试宠物
- 🍽️ 5条饮食记录
- ⚖️ 7条体重记录
- 💉 3条疫苗记录
- 🔔 4条提醒

### 方法3: 手动测试 (Postman/浏览器)

使用Postman或浏览器直接测试各个端点。

## 📊 测试结果解读

### ✅ 成功标志
- 状态码符合预期 (200, 201等)
- 返回正确的数据格式
- 数据库操作成功

### ❌ 失败标志  
- 状态码不符合预期
- 返回错误信息
- 数据库操作失败

### ⚠️ 警告标志
- 测试被跳过 (通常是因为依赖项未创建)
- 非关键功能异常

## 🔍 详细测试用例

### 饮食记录测试

```bash
# 创建饮食记录
POST /diet-logs/
{
  "pet_id": 1,
  "date": "2024-01-15",
  "description": "狗粮",
  "meal_type": "早餐",
  "food_amount": 100.0,
  "unit": "克",
  "feeding_time": "08:00"
}

# 获取宠物的饮食记录
GET /diet-logs/pet/1

# 获取单个饮食记录
GET /diet-logs/1

# 更新饮食记录
PUT /diet-logs/1
{
  "description": "更新后的狗粮"
}
```

### 体重记录测试

```bash
# 创建体重记录
POST /weight-logs/
{
  "pet_id": 1,
  "date": "2024-01-15",
  "weight_kg": 25.5
}

# 获取体重变化趋势
GET /weight-logs/pet/1/trend
```

### 疫苗记录测试

```bash
# 创建疫苗记录
POST /vaccine-logs/
{
  "pet_id": 1,
  "date": "2024-01-15",
  "vaccine_type": "狂犬疫苗",
  "notes": "第一针",
  "next_due_date": "2025-01-15",
  "reminder_enabled": true
}

# 获取即将到期的疫苗
GET /vaccine-logs/pet/1/upcoming
```

### 提醒系统测试

```bash
# 创建提醒
POST /reminders/
{
  "pet_id": 1,
  "reminder_type": "vaccine",
  "due_date": "2024-02-15",
  "message": "疫苗到期提醒"
}

# 获取即将到期的提醒
GET /reminders/due-soon

# 标记提醒为已发送
PATCH /reminders/1/mark-sent
```

## 🐛 常见问题排查

### 1. 连接失败
```
❌ 无法连接到后端服务
```
**解决方案**: 确保后端服务正在运行，检查端口5000是否被占用

### 2. 数据库错误
```
❌ 创建记录失败: (sqlite3.IntegrityError) UNIQUE constraint failed
```
**解决方案**: 检查数据是否重复，或者清理测试数据库

### 3. 字段验证错误
```
❌ 创建记录失败: date must be YYYY-MM-DD
```
**解决方案**: 检查日期格式是否正确

### 4. 外键约束错误
```
❌ 创建记录失败: FOREIGN KEY constraint failed
```
**解决方案**: 确保引用的宠物ID存在

## 📈 性能测试建议

### 批量数据测试
```bash
# 修改create_test_data.py中的count参数
create_diet_logs(pet["id"], count=100)  # 创建100条记录
```

### 并发测试
可以使用Apache Bench或类似工具测试并发性能：
```bash
ab -n 1000 -c 10 http://localhost:5001/pets/
```

## 🎯 测试目标

确保以下功能正常工作：

1. **数据完整性**: 所有字段正确保存和读取
2. **关联关系**: 外键约束正常工作
3. **数据验证**: 输入验证和错误处理
4. **查询过滤**: 日期范围、类型等过滤功能
5. **CRUD操作**: 增删改查功能完整
6. **错误处理**: 异常情况下的响应

## 📝 测试报告

运行测试后，你会看到详细的测试报告，包括：
- 每个端点的测试结果
- 成功/失败统计
- 错误信息和响应内容
- 测试执行时间

## 🔄 持续测试

建议在以下情况下运行测试：
- 添加新功能后
- 修改现有代码后
- 部署到生产环境前
- 定期回归测试

## 📞 获取帮助

如果遇到测试问题：
1. 检查后端服务状态
2. 查看控制台错误信息
3. 验证数据库连接
4. 检查API端点配置

---

**祝测试顺利！** 🎉 