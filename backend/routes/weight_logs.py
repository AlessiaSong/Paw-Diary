from flask import Blueprint, request, jsonify
from models import WeightLog, Pet
from config import db
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

# 创建weight_logs Blueprint
weight_logs_bp = Blueprint('weight_logs', __name__, url_prefix='/weight-logs')

@weight_logs_bp.route("/", methods=["POST"])
def create_weight_log():
    """
    POST /weight-logs
    JSON body: {
        "pet_id": 1,
        "date": "2024-01-15",
        "weight_kg": 25.5
    }
    """
    data = request.get_json() or {}
    
    # 验证必需字段
    required_fields = ["pet_id", "date", "weight_kg"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"{field} is required"}), 400
    
    # 验证宠物是否存在
    pet = Pet.query.get(data.get("pet_id"))
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 验证体重数据
    try:
        weight_kg = float(data.get("weight_kg"))
        if weight_kg <= 0:
            return jsonify({"message": "weight_kg must be positive"}), 400
    except (ValueError, TypeError):
        return jsonify({"message": "weight_kg must be a valid number"}), 400
    
    # 解析日期
    try:
        date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "date must be YYYY-MM-DD"}), 400
    
    weight_log = WeightLog(
        pet_id=pet.id,
        date=date,
        weight_kg=weight_kg
    )
    
    try:
        db.session.add(weight_log)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Weight log created", "weight_log": weight_log.to_json()}), 201

@weight_logs_bp.route("/pet/<int:pet_id>", methods=["GET"])
def get_pet_weight_logs(pet_id):
    """
    GET /weight-logs/pet/<pet_id>
    optional query params: ?start_date=2024-01-01&end_date=2024-01-31&limit=10
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 构建查询
    query = WeightLog.query.filter_by(pet_id=pet_id)
    
    # 日期范围过滤
    start_date = request.args.get("start_date")
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(WeightLog.date >= start_date)
        except ValueError:
            return jsonify({"message": "start_date must be YYYY-MM-DD"}), 400
    
    end_date = request.args.get("end_date")
    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(WeightLog.date <= end_date)
        except ValueError:
            return jsonify({"message": "end_date must be YYYY-MM-DD"}), 400
    
    # 限制返回数量
    limit = request.args.get("limit", type=int)
    if limit:
        query = query.limit(limit)
    
    # 排序（按日期降序）
    query = query.order_by(WeightLog.date.desc())
    
    weight_logs = query.all()
    return jsonify({"weight_logs": [log.to_json() for log in weight_logs]}), 200

@weight_logs_bp.route("/pet/<int:pet_id>/trend", methods=["GET"])
def get_weight_trend(pet_id):
    """
    GET /weight-logs/pet/<pet_id>/trend
    获取体重变化趋势，返回最近10次记录
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    weight_logs = WeightLog.query.filter_by(pet_id=pet_id)\
        .order_by(WeightLog.date.desc())\
        .limit(10)\
        .all()
    
    # 计算体重变化
    trend_data = []
    for i, log in enumerate(weight_logs):
        change = None
        if i < len(weight_logs) - 1:
            change = log.weight_kg - weight_logs[i + 1].weight_kg
        
        trend_data.append({
            "date": log.date.strftime("%Y-%m-%d"),
            "weight_kg": log.weight_kg,
            "change": change
        })
    
    return jsonify({"weight_trend": trend_data}), 200

@weight_logs_bp.route("/<int:log_id>", methods=["GET"])
def get_weight_log(log_id):
    """
    GET /weight-logs/<log_id>
    """
    weight_log = WeightLog.query.get(log_id)
    if not weight_log:
        return jsonify({"message": "Weight log not found"}), 404
    
    return jsonify({"weight_log": weight_log.to_json()}), 200

@weight_logs_bp.route("/<int:log_id>", methods=["PUT"])
def update_weight_log(log_id):
    """
    PUT /weight-logs/<log_id>
    JSON body: 可包含 date, weight_kg
    """
    weight_log = WeightLog.query.get(log_id)
    if not weight_log:
        return jsonify({"message": "Weight log not found"}), 404
    
    data = request.get_json() or {}
    
    # 更新字段
    if "date" in data:
        try:
            weight_log.date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "date must be YYYY-MM-DD"}), 400
    
    if "weight_kg" in data:
        try:
            weight_kg = float(data.get("weight_kg"))
            if weight_kg <= 0:
                return jsonify({"message": "weight_kg must be positive"}), 400
            weight_log.weight_kg = weight_kg
        except (ValueError, TypeError):
            return jsonify({"message": "weight_kg must be a valid number"}), 400
    
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Weight log updated", "weight_log": weight_log.to_json()}), 200

@weight_logs_bp.route("/<int:log_id>", methods=["DELETE"])
def delete_weight_log(log_id):
    """
    DELETE /weight-logs/<log_id>
    """
    weight_log = WeightLog.query.get(log_id)
    if not weight_log:
        return jsonify({"message": "Weight log not found"}), 404
    
    try:
        db.session.delete(weight_log)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Weight log deleted"}), 200 