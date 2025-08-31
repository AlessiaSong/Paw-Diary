# Paw Diary Backend

基于 Flask 的宠物日记后端 API 服务

## 项目结构

```
backend/
│
├── main.py              # Flask 应用入口
├── config.py            # 配置和数据库初始化
├── models.py            # 数据模型定义
├── requirements.txt     # Python 依赖
│
└── routes/              # 路由模块
    ├── __init__.py      # 路由包初始化
    ├── users.py         # 用户相关路由
    └── pets.py          # 宠物相关路由
```

## 技术栈

- **Web 框架**: Flask
- **数据库**: SQLite (开发环境) / PostgreSQL (生产环境)
- **ORM**: SQLAlchemy
- **架构模式**: Blueprint 蓝图模式

## 主要特性

1. **模块化设计**: 使用 Flask Blueprint 组织路由
2. **代码组织**: 每个业务对象（users、pets）都有自己独立的路由文件
3. **RESTful API**: 遵循 REST 设计原则
4. **数据验证**: 基本的请求数据验证
5. **错误处理**: 统一的错误响应格式

## API 端点

### 用户 (Users)
- `GET /users/` - 获取所有用户
- `POST /users/create` - 创建新用户
- `PATCH /users/<user_id>` - 更新用户信息
- `POST /users/login` - 用户登录
- `DELETE /users/<user_id>` - 删除用户

### 宠物 (Pets)
- `POST /pets/` - 创建新宠物
- `GET /pets/` - 获取宠物列表（支持user_id过滤）
- `GET /pets/<pet_id>` - 获取单个宠物详情
- `PATCH /pets/<pet_id>` - 更新宠物信息
- `DELETE /pets/<pet_id>` - 删除宠物

## 运行项目

```bash
cd backend
python main.py
```

应用将在 http://localhost:5001 启动。