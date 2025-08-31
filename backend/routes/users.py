from flask import Blueprint, request, jsonify
from models import User
from config import db

# 创建users Blueprint
users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route("/", methods=["GET"])
def get_users():
    """获取所有用户列表"""
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"users": json_users})


@users_bp.route("/register", methods=["POST"])
def register_user():
    """用户注册"""
    data = request.get_json()
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not first_name or not last_name or not email or not password:
        return (
            jsonify({"message": "You must include a first name, last name, email, and your password"}),
            400,
        )

    # 检查邮箱是否已存在
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Email already exists"}), 409

    new_user = User(first_name=first_name, last_name=last_name, email=email, password=password)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

@users_bp.route("/create", methods=["POST"])
def create_user():
    """创建新用户 (保持向后兼容)"""
    return register_user()


@users_bp.route("/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    """更新用户信息"""
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.first_name = data.get("firstName", user.first_name)
    user.last_name = data.get("lastName", user.last_name)
    user.email = data.get("email", user.email)

    db.session.commit()

    return jsonify({"message": "User updated."}), 200


@users_bp.route("/login", methods=["POST"])
def login_user():
    """用户登录验证"""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not existing with this email"}), 404
    
    json_user = user.to_json()
    
    if password == user.password:
        return jsonify(json_user), 200
    else:
        return jsonify({"message": "Incorrect password"}), 401


@users_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    """删除用户"""
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200 