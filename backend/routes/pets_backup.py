from flask import Blueprint, request, jsonify
from models import Pet, User
from config import db
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

# 创建pets Blueprint
pets_bp = Blueprint('pets', __name__, url_prefix='/pets')

@pets_bp.route("/", methods=["POST"])
def create_pet():
    """
    POST /pets
    JSON body: { "user_id": 1, "name": "Bobby", "species": "Dog", "breed": "Corgi", "birth_date": "2020-05-01" }
    """
    data = request.get_json() or {}

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    owner = User.query.get(user_id)
    if not owner:
        return jsonify({"message": "User not found"}), 404

    name = data.get("name")
    species = data.get("species")
    breed = data.get("breed")
    birth_date_str = data.get("birth_date")

    # 可选：解析 birth_date 字符串为 date 对象（格式 YYYY-MM-DD）
    birth_date = None
    if birth_date_str:
        try:
            birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "birth_date must be YYYY-MM-DD"}), 400

    pet = Pet(
        name=name,
        species=species,
        breed=breed,
        birth_date=birth_date,
        user_id=owner.id
    )

    try:
        db.session.add(pet)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Pet created", "pet": pet.to_json()}), 201


@pets_bp.route("/", methods=["GET"])
def list_pets():
    """
    GET /pets
    optional query param: ?user_id=1  (如果不传则返回所有宠物，开发阶段使用；上线建议强制过滤为当前登录用户)
    """
    user_id = request.args.get("user_id", type=int)
    if user_id:
        pets = Pet.query.filter_by(user_id=user_id).all()
    else:
        pets = Pet.query.all()

    return jsonify({"pets": [p.to_json() for p in pets]}), 200


@pets_bp.route("/<int:pet_id>", methods=["GET"])
def get_pet(pet_id):
    """
    GET /pets/<pet_id>
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404

    return jsonify({"pet": pet.to_json()}), 200


@pets_bp.route("/<int:pet_id>", methods=["PATCH"])
def update_pet(pet_id):
    """
    PATCH /pets/<pet_id>
    JSON body: 可包含 name, species, breed, birth_date, user_id(用于权限校验)
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404

    data = request.get_json() or {}

    # 简单的权限校验（因为没有 JWT），建议前端传 user_id 以校验是谁在操作
    requester_id = data.get("user_id")
    if requester_id is not None and requester_id != pet.user_id:
        return jsonify({"message": "Permission denied"}), 403

    if "name" in data:
        pet.name = data.get("name")
    if "species" in data:
        pet.species = data.get("species")
    if "breed" in data:
        pet.breed = data.get("breed")
    if "birth_date" in data:
        bd = data.get("birth_date")
        if bd:
            try:
                pet.birth_date = datetime.strptime(bd, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"message": "birth_date must be YYYY-MM-DD"}), 400
        else:
            pet.birth_date = None

    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Pet updated", "pet": pet.to_json()}), 200


@pets_bp.route("/<int:pet_id>", methods=["DELETE"])
def delete_pet(pet_id):
    """
    DELETE /pets/<pet_id>
    optional JSON body or query param user_id 用于权限校验
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404

    # 权限检查（没有认证时的临时做法）
    requester_id = request.args.get("user_id", type=int)
    if requester_id is None:
        try:
            body = request.get_json() or {}
            requester_id = body.get("user_id")
        except:
            requester_id = None

    if requester_id is not None and requester_id != pet.user_id:
        return jsonify({"message": "Permission denied"}), 403

    try:
        db.session.delete(pet)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Pet deleted"}), 200 