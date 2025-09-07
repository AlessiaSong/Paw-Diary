# Paw Diary - 宠物日记应用

一个完整的宠物管理应用，帮助用户记录和管理宠物的健康信息，包括体重、饮食、疫苗等数据。

## 功能特性

### 🐾 宠物管理
- 注册和管理多个宠物
- 记录宠物基本信息（品种、性别、出生日期等）
- 宠物档案管理

### 📊 体重管理
- 记录宠物体重变化
- 查看体重历史记录
- 体重趋势分析

### 🍽️ 饮食记录
- 记录宠物饮食情况
- 食物类型和数量管理
- 饮食历史查看

### 💉 疫苗管理
- 记录疫苗接种信息
- 疫苗到期提醒
- 疫苗接种历史

### 👤 用户系统
- 用户注册和登录
- 个人宠物管理
- 数据隔离

## 技术栈

### 后端
- **Flask** - Python Web框架
- **SQLAlchemy** - ORM数据库操作
- **SQLite** - 数据库（开发环境）
- **RESTful API** - 接口设计

### 前端
- **React** - 前端框架
- **React Router** - 路由管理
- **Lucide React** - 图标库
- **Vite** - 构建工具

## 项目结构

```
Paw Diary/
├── backend/                 # 后端代码
│   ├── routes/              # API路由
│   │   ├── users.py         # 用户管理
│   │   ├── pets.py          # 宠物管理
│   │   ├── weight_logs.py   # 体重记录
│   │   ├── diet_logs.py     # 饮食记录
│   │   └── vaccine_logs.py   # 疫苗记录
│   ├── models.py            # 数据模型
│   ├── config.py            # 配置文件
│   └── main.py              # 主程序
├── frontend/                # 前端代码
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── App.jsx          # 主应用
│   │   └── config.js        # 前端配置
│   └── package.json
└── README.md
```

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd Paw\ Diary
```

### 2. 启动后端服务
```bash
cd backend
pip install -r requirements.txt
python main.py
```

后端服务将在 `http://localhost:5001` 启动

### 3. 启动前端服务
```bash
cd frontend
npm install
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

### 4. 访问应用
打开浏览器访问 `http://localhost:5173`

## API 文档

### 用户管理
- `GET /users/` - 获取用户列表
- `POST /users/` - 创建新用户
- `POST /users/login` - 用户登录

### 宠物管理
- `GET /pets/?user_id={id}` - 获取用户的宠物列表
- `POST /pets/` - 创建新宠物
- `GET /pets/{id}` - 获取宠物详情
- `PATCH /pets/{id}` - 更新宠物信息
- `DELETE /pets/{id}` - 删除宠物

### 体重记录
- `GET /weight-logs/pet/{pet_id}` - 获取宠物体重记录
- `POST /weight-logs/` - 创建体重记录

### 饮食记录
- `GET /diet-logs/pet/{pet_id}` - 获取宠物饮食记录
- `POST /diet-logs/` - 创建饮食记录

### 疫苗记录
- `GET /vaccine-logs/pet/{pet_id}` - 获取宠物疫苗记录
- `POST /vaccine-logs/` - 创建疫苗记录
- `GET /vaccine-logs/pet/{pet_id}/upcoming` - 获取即将到期的疫苗

## 使用说明

### 1. 注册和登录
- 首次使用需要注册账号
- 使用邮箱和密码登录

### 2. 添加宠物
- 登录后点击"添加宠物"按钮
- 填写宠物基本信息
- 支持多种宠物类型（狗、猫、鸟等）

### 3. 管理宠物信息
- 点击左侧宠物列表选择宠物
- 查看宠物详细信息和各种记录
- 使用标签页切换不同功能

### 4. 记录数据
- **体重记录**: 定期记录宠物体重变化
- **饮食记录**: 记录食物类型和数量
- **疫苗记录**: 记录疫苗接种和到期时间

### 5. 查看统计
- 在概览页面查看宠物基本信息
- 查看最近的体重、饮食、疫苗记录
- 疫苗到期提醒

## 开发说明

### 后端开发
```bash
cd backend
# 安装依赖
pip install -r requirements.txt

# 运行开发服务器
python main.py

# 运行测试
python test_api.py
```

### 前端开发
```bash
cd frontend
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 数据库设计

### 主要数据表
- **users** - 用户信息
- **pets** - 宠物基本信息
- **weight_logs** - 体重记录
- **diet_logs** - 饮食记录
- **vaccine_logs** - 疫苗记录
- **reminders** - 提醒设置

## 部署说明

### 生产环境部署
1. 配置生产数据库（PostgreSQL/MySQL）
2. 设置环境变量
3. 构建前端代码
4. 配置Web服务器（Nginx）
5. 使用WSGI服务器运行Flask应用

### Docker部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。
