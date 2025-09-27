from flask import Blueprint, request, jsonify
from models import Pet, User, WeightLog, DietLog, VaccineLog
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
def get_pets():
    """
    GET /pets?user_id=1
    """
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    pets = Pet.query.filter_by(user_id=user_id).all()
    return jsonify({"pets": [pet.to_json() for pet in pets]}), 200

@pets_bp.route("/<int:pet_id>", methods=["GET"])
def get_pet(pet_id):
    """
    GET /pets/<pet_id>
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404

    return jsonify({"pet": pet.to_json()}), 200

@pets_bp.route("/<int:pet_id>", methods=["PUT"])
def update_pet(pet_id):
    """
    PUT /pets/<pet_id>
    JSON body: { "name": "New Name", "species": "Cat", "breed": "Persian", "birth_date": "2020-05-01" }
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404

    data = request.get_json() or {}

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

# 添加获取宠物日志的路由
@pets_bp.route("/<int:pet_id>/weight_logs", methods=["GET"])
def get_pet_weight_logs(pet_id):
    """
    GET /pets/<pet_id>/weight_logs
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    weight_logs = WeightLog.query.filter_by(pet_id=pet_id).order_by(WeightLog.date.desc()).all()
    return jsonify({"weight_logs": [log.to_json() for log in weight_logs]}), 200

@pets_bp.route("/<int:pet_id>/diet_logs", methods=["GET"])
def get_pet_diet_logs(pet_id):
    """
    GET /pets/<pet_id>/diet_logs
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    diet_logs = DietLog.query.filter_by(pet_id=pet_id).order_by(DietLog.date.desc()).all()
    return jsonify({"diet_logs": [log.to_json() for log in diet_logs]}), 200

@pets_bp.route("/<int:pet_id>/vaccine_logs", methods=["GET"])
def get_pet_vaccine_logs(pet_id):
    """
    GET /pets/<pet_id>/vaccine_logs
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    vaccine_logs = VaccineLog.query.filter_by(pet_id=pet_id).order_by(VaccineLog.date.desc()).all()
    return jsonify({"vaccine_logs": [log.to_json() for log in vaccine_logs]}), 200
