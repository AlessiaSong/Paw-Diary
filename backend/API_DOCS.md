# Paw Diary API 文档

## 基础信息
- 基础URL: `http://localhost:5001`
- 所有请求和响应都使用JSON格式
- 日期格式: `YYYY-MM-DD`
- 时间格式: `HH:MM`

## 用户管理 (Users)

### 用户注册
- **POST** `/users/register`
- 请求体: `{"first_name": "John", "last_name": "Doe", "email": "john@example.com", "password": "password123"}`

### 用户登录
- **POST** `/users/login`
- 请求体: `{"email": "john@example.com", "password": "password123"}`

### 获取用户列表
- **GET** `/users/`

## 宠物管理 (Pets)

### 创建宠物
- **POST** `/pets/`
- 请求体: `{"user_id": 1, "name": "Bobby", "species": "Dog", "breed": "Corgi", "birth_date": "2020-05-01"}`

### 获取宠物列表
- **GET** `/pets/`
- 查询参数: `?user_id=1`

### 获取单个宠物
- **GET** `/pets/<pet_id>`

### 更新宠物
- **PATCH** `/pets/<pet_id>`
- 请求体: 可包含 `name`, `species`, `breed`, `birth_date`

### 删除宠物
- **DELETE** `/pets/<pet_id>`

## 饮食记录 (Diet Logs)

### 创建饮食记录
- **POST** `/diet-logs/`
- 请求体: `{"pet_id": 1, "date": "2024-01-15", "description": "狗粮", "meal_type": "早餐", "food_amount": 100.0, "unit": "克", "feeding_time": "08:00"}`

### 获取宠物的饮食记录
- **GET** `/diet-logs/pet/<pet_id>`
- 查询参数: `?start_date=2024-01-01&end_date=2024-01-31&meal_type=早餐`

### 获取单个饮食记录
- **GET** `/diet-logs/<log_id>`

### 更新饮食记录
- **PUT** `/diet-logs/<log_id>`
- 请求体: 可包含 `date`, `description`, `meal_type`, `food_amount`, `unit`, `feeding_time`

### 删除饮食记录
- **DELETE** `/diet-logs/<log_id>`

## 体重记录 (Weight Logs)

### 创建体重记录
- **POST** `/weight-logs/`
- 请求体: `{"pet_id": 1, "date": "2024-01-15", "weight_kg": 25.5}`

### 获取宠物的体重记录
- **GET** `/weight-logs/pet/<pet_id>`
- 查询参数: `?start_date=2024-01-01&end_date=2024-01-31&limit=10`

### 获取体重变化趋势
- **GET** `/weight-logs/pet/<pet_id>/trend`

### 获取单个体重记录
- **GET** `/weight-logs/<log_id>`

### 更新体重记录
- **PUT** `/weight-logs/<log_id>`
- 请求体: 可包含 `date`, `weight_kg`

### 删除体重记录
- **DELETE** `/weight-logs/<log_id>`

## 疫苗记录 (Vaccine Logs)

### 创建疫苗记录
- **POST** `/vaccine-logs/`
- 请求体: `{"pet_id": 1, "date": "2024-01-15", "vaccine_type": "狂犬疫苗", "notes": "第一针", "next_due_date": "2025-01-15", "reminder_enabled": true}`

### 获取宠物的疫苗记录
- **GET** `/vaccine-logs/pet/<pet_id>`
- 查询参数: `?start_date=2024-01-01&end_date=2024-01-31&vaccine_type=狂犬疫苗`

### 获取即将到期的疫苗
- **GET** `/vaccine-logs/pet/<pet_id>/upcoming`

### 获取单个疫苗记录
- **GET** `/vaccine-logs/<log_id>`

### 更新疫苗记录
- **PUT** `/vaccine-logs/<log_id>`
- 请求体: 可包含 `date`, `vaccine_type`, `notes`, `next_due_date`, `reminder_enabled`

### 删除疫苗记录
- **DELETE** `/vaccine-logs/<log_id>`

## 提醒系统 (Reminders)

### 创建提醒
- **POST** `/reminders/`
- 请求体: `{"pet_id": 1, "reminder_type": "vaccine", "due_date": "2024-02-15", "message": "狂犬疫苗到期提醒"}`

### 获取宠物的提醒
- **GET** `/reminders/pet/<pet_id>`
- 查询参数: `?reminder_type=vaccine&status=active&limit=10`

### 获取过期提醒
- **GET** `/reminders/overdue`

### 获取即将到期的提醒
- **GET** `/reminders/due-soon`

### 获取单个提醒
- **GET** `/reminders/<reminder_id>`

### 更新提醒
- **PUT** `/reminders/<reminder_id>`
- 请求体: 可包含 `reminder_type`, `due_date`, `message`, `is_sent`

### 标记提醒为已发送
- **PATCH** `/reminders/<reminder_id>/mark-sent`

### 删除提醒
- **DELETE** `/reminders/<reminder_id>`

## 状态码说明

- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `404` - 资源不存在
- `403` - 权限不足
- `500` - 服务器内部错误

## 数据模型说明

### 提醒类型 (reminder_type)
- `vaccine` - 疫苗提醒
- `weight` - 体重提醒
- `diet` - 饮食提醒
- `general` - 通用提醒

### 餐次类型 (meal_type)
- `早餐` - 早餐
- `午餐` - 午餐
- `晚餐` - 晚餐
- `零食` - 零食

### 状态过滤 (status)
- `active` - 活跃的（未过期）
- `overdue` - 过期的
- `sent` - 已发送的
- `pending` - 待发送的 