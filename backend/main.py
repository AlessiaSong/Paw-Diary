from flask import Flask, send_from_directory
from config import app, db
import os

# 导入Blueprint - 现在可以从routes包直接导入
from routes import users_bp, pets_bp

# 注册Blueprint
app.register_blueprint(users_bp)
app.register_blueprint(pets_bp)

# 前端服务路由
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    # /home/ubuntu/FLASK-REACT-FULL-STACK-APP/frontend/dist
    dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
    file_path = os.path.join(dist_dir, path)

    if path and os.path.exists(file_path):
        return send_from_directory(dist_dir, path)
    return send_from_directory(dist_dir, "index.html")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
    # app.run(host='0.0.0.0', port=5000)

