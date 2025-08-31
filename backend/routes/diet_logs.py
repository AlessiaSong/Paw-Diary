from flask import Blueprint, request, jsonify
from models import DietLog, Pet, User
from config import db
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

# 创建diet_logs Blueprint
diet_logs_bp = Blueprint('diet_logs', __name__, url_prefix='/diet-logs')

@diet_logs_bp.route("/", methods=["POST"])
def create_diet_log():
    """
    POST /diet-logs
    JSON body: {
        "pet_id": 1,
        "date": "2024-01-15",
        "description": "狗粮",
        "meal_type": "早餐",
        "food_amount": 100.0,
        "unit": "克",
        "feeding_time": "08:00"
    }
    """
    data = request.get_json() or {}
    
    # 验证必需字段
    required_fields = ["pet_id", "date"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"{field} is required"}), 400
    
    # 验证宠物是否存在
    pet = Pet.query.get(data.get("pet_id"))
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 解析日期
    try:
        date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "date must be YYYY-MM-DD"}), 400
    
    # 解析喂食时间
    feeding_time = None
    if data.get("feeding_time"):
        try:
            feeding_time = datetime.strptime(data.get("feeding_time"), "%H:%M").time()
        except ValueError:
            return jsonify({"message": "feeding_time must be HH:MM"}), 400
    
    diet_log = DietLog(
        pet_id=pet.id,
        date=date,
        description=data.get("description"),
        meal_type=data.get("meal_type"),
        food_amount=data.get("food_amount"),
        unit=data.get("unit"),
        feeding_time=feeding_time
    )
    
    try:
        db.session.add(diet_log)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Diet log created", "diet_log": diet_log.to_json()}), 201

@diet_logs_bp.route("/pet/<int:pet_id>", methods=["GET"])
def get_pet_diet_logs(pet_id):
    """
    GET /diet-logs/pet/<pet_id>
    optional query params: ?start_date=2024-01-01&end_date=2024-01-31&meal_type=早餐
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 构建查询
    query = DietLog.query.filter_by(pet_id=pet_id)
    
    # 日期范围过滤
    start_date = request.args.get("start_date")
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(DietLog.date >= start_date)
        except ValueError:
            return jsonify({"message": "start_date must be YYYY-MM-DD"}), 400
    
    end_date = request.args.get("end_date")
    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(DietLog.date <= end_date)
        except ValueError:
            return jsonify({"message": "end_date must be YYYY-MM-DD"}), 400
    
    # 餐次类型过滤
    meal_type = request.args.get("meal_type")
    if meal_type:
        query = query.filter_by(meal_type=meal_type)
    
    # 排序
    query = query.order_by(DietLog.date.desc(), DietLog.feeding_time.desc())
    
    diet_logs = query.all()
    return jsonify({"diet_logs": [log.to_json() for log in diet_logs]}), 200

@diet_logs_bp.route("/<int:log_id>", methods=["GET"])
def get_diet_log(log_id):
    """
    GET /diet-logs/<log_id>
    """
    diet_log = DietLog.query.get(log_id)
    if not diet_log:
        return jsonify({"message": "Diet log not found"}), 404
    
    return jsonify({"diet_log": diet_log.to_json()}), 200

@diet_logs_bp.route("/<int:log_id>", methods=["PUT"])
def update_diet_log(log_id):
    """
    PUT /diet-logs/<log_id>
    JSON body: 可包含 date, description, meal_type, food_amount, unit, feeding_time
    """
    diet_log = DietLog.query.get(log_id)
    if not diet_log:
        return jsonify({"message": "Diet log not found"}), 404
    
    data = request.get_json() or {}
    
    # 更新字段
    if "date" in data:
        try:
            diet_log.date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "date must be YYYY-MM-DD"}), 400
    
    if "description" in data:
        diet_log.description = data.get("description")
    
    if "meal_type" in data:
        diet_log.meal_type = data.get("meal_type")
    
    if "food_amount" in data:
        diet_log.food_amount = data.get("food_amount")
    
    if "unit" in data:
        diet_log.unit = data.get("unit")
    
    if "feeding_time" in data:
        if data.get("feeding_time"):
            try:
                diet_log.feeding_time = datetime.strptime(data.get("feeding_time"), "%H:%M").time()
            except ValueError:
                return jsonify({"message": "feeding_time must be HH:MM"}), 400
        else:
            diet_log.feeding_time = None
    
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Diet log updated", "diet_log": diet_log.to_json()}), 200

@diet_logs_bp.route("/<int:log_id>", methods=["DELETE"])
def delete_diet_log(log_id):
    """
    DELETE /diet-logs/<log_id>
    """
    diet_log = DietLog.query.get(log_id)
    if not diet_log:
        return jsonify({"message": "Diet log not found"}), 404
    
    try:
        db.session.delete(diet_log)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Diet log deleted"}), 200 