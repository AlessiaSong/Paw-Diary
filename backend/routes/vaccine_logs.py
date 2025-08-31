from flask import Blueprint, request, jsonify
from models import VaccineLog, Pet
from config import db
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

# 创建vaccine_logs Blueprint
vaccine_logs_bp = Blueprint('vaccine_logs', __name__, url_prefix='/vaccine-logs')

@vaccine_logs_bp.route("/", methods=["POST"])
def create_vaccine_log():
    """
    POST /vaccine-logs
    JSON body: {
        "pet_id": 1,
        "date": "2024-01-15",
        "vaccine_type": "狂犬疫苗",
        "notes": "第一针",
        "next_due_date": "2025-01-15",
        "reminder_enabled": true
    }
    """
    data = request.get_json() or {}
    
    # 验证必需字段
    required_fields = ["pet_id", "date", "vaccine_type"]
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
    
    # 解析下次接种日期
    next_due_date = None
    if data.get("next_due_date"):
        try:
            next_due_date = datetime.strptime(data.get("next_due_date"), "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "next_due_date must be YYYY-MM-DD"}), 400
    
    vaccine_log = VaccineLog(
        pet_id=pet.id,
        date=date,
        vaccine_type=data.get("vaccine_type"),
        notes=data.get("notes"),
        next_due_date=next_due_date,
        reminder_enabled=data.get("reminder_enabled", True)
    )
    
    try:
        db.session.add(vaccine_log)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Vaccine log created", "vaccine_log": vaccine_log.to_json()}), 201

@vaccine_logs_bp.route("/pet/<int:pet_id>", methods=["GET"])
def get_pet_vaccine_logs(pet_id):
    """
    GET /vaccine-logs/pet/<pet_id>
    optional query params: ?start_date=2024-01-01&end_date=2024-01-31&vaccine_type=狂犬疫苗
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 构建查询
    query = VaccineLog.query.filter_by(pet_id=pet_id)
    
    # 日期范围过滤
    start_date = request.args.get("start_date")
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            query = query.filter(VaccineLog.date >= start_date)
        except ValueError:
            return jsonify({"message": "start_date must be YYYY-MM-DD"}), 400
    
    end_date = request.args.get("end_date")
    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(VaccineLog.date <= end_date)
        except ValueError:
            return jsonify({"message": "end_date must be YYYY-MM-DD"}), 400
    
    # 疫苗类型过滤
    vaccine_type = request.args.get("vaccine_type")
    if vaccine_type:
        query = query.filter_by(vaccine_type=vaccine_type)
    
    # 排序（按日期降序）
    query = query.order_by(VaccineLog.date.desc())
    
    vaccine_logs = query.all()
    return jsonify({"vaccine_logs": [log.to_json() for log in vaccine_logs]}), 200

@vaccine_logs_bp.route("/pet/<int:pet_id>/upcoming", methods=["GET"])
def get_upcoming_vaccines(pet_id):
    """
    GET /vaccine-logs/pet/<pet_id>/upcoming
    获取即将到期的疫苗提醒
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 获取30天内到期的疫苗
    today = datetime.now().date()
    thirty_days_later = today + timedelta(days=30)
    
    upcoming_vaccines = VaccineLog.query.filter(
        VaccineLog.pet_id == pet_id,
        VaccineLog.next_due_date >= today,
        VaccineLog.next_due_date <= thirty_days_later,
        VaccineLog.reminder_enabled == True
    ).order_by(VaccineLog.next_due_date).all()
    
    return jsonify({"upcoming_vaccines": [log.to_json() for log in upcoming_vaccines]}), 200

@vaccine_logs_bp.route("/<int:log_id>", methods=["GET"])
def get_vaccine_log(log_id):
    """
    GET /vaccine-logs/<log_id>
    """
    vaccine_log = VaccineLog.query.get(log_id)
    if not vaccine_log:
        return jsonify({"message": "Vaccine log not found"}), 404
    
    return jsonify({"vaccine_log": vaccine_log.to_json()}), 200

@vaccine_logs_bp.route("/<int:log_id>", methods=["PUT"])
def update_vaccine_log(log_id):
    """
    PUT /vaccine-logs/<log_id>
    JSON body: 可包含 date, vaccine_type, notes, next_due_date, reminder_enabled
    """
    vaccine_log = VaccineLog.query.get(log_id)
    if not vaccine_log:
        return jsonify({"message": "Vaccine log not found"}), 404
    
    data = request.get_json() or {}
    
    # 更新字段
    if "date" in data:
        try:
            vaccine_log.date = datetime.strptime(data.get("date"), "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "date must be YYYY-MM-DD"}), 400
    
    if "vaccine_type" in data:
        vaccine_log.vaccine_type = data.get("vaccine_type")
    
    if "notes" in data:
        vaccine_log.notes = data.get("notes")
    
    if "next_due_date" in data:
        if data.get("next_due_date"):
            try:
                vaccine_log.next_due_date = datetime.strptime(data.get("next_due_date"), "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"message": "next_due_date must be YYYY-MM-DD"}), 400
        else:
            vaccine_log.next_due_date = None
    
    if "reminder_enabled" in data:
        vaccine_log.reminder_enabled = bool(data.get("reminder_enabled"))
    
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Vaccine log updated", "vaccine_log": vaccine_log.to_json()}), 200

@vaccine_logs_bp.route("/<int:log_id>", methods=["DELETE"])
def delete_vaccine_log(log_id):
    """
    DELETE /vaccine-logs/<log_id>
    """
    vaccine_log = VaccineLog.query.get(log_id)
    if not vaccine_log:
        return jsonify({"message": "Vaccine log not found"}), 404
    
    try:
        db.session.delete(vaccine_log)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Vaccine log deleted"}), 200 