from flask import Flask, send_from_directory
from config import app, db
import os

# 导入Blueprint - 现在可以从routes包直接导入
from routes import users_bp, pets_bp, diet_logs_bp, weight_logs_bp, vaccine_logs_bp, reminders_bp

# 注册Blueprint
app.register_blueprint(users_bp)
app.register_blueprint(pets_bp)
app.register_blueprint(diet_logs_bp)
app.register_blueprint(weight_logs_bp)
app.register_blueprint(vaccine_logs_bp)
app.register_blueprint(reminders_bp)

# 前端服务路由 (仅在开发环境需要时启用)
# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def serve_frontend(path):
#     # /home/ubuntu/FLASK-REACT-FULL-STACK-APP/frontend/dist
#     dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
#     file_path = os.path.join(dist_dir, path)
#
#     if path and os.path.exists(file_path):
#         return send_from_directory(dist_dir, path)
#     return send_from_directory(dist_dir, "index.html")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    print("🚀 启动后端服务...")
    print("🌐 服务地址: http://localhost:5001")
    print("📝 使用端口5001避免与macOS系统服务冲突")
    
    app.run(debug=True, port=5001)

