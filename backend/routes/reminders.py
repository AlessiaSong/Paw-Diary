from flask import Blueprint, request, jsonify
from models import Reminder, Pet
from config import db
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timedelta

# 创建reminders Blueprint
reminders_bp = Blueprint('reminders', __name__, url_prefix='/reminders')

@reminders_bp.route("/", methods=["POST"])
def create_reminder():
    """
    POST /reminders
    JSON body: {
        "pet_id": 1,
        "reminder_type": "vaccine",
        "due_date": "2024-02-15",
        "message": "狂犬疫苗到期提醒"
    }
    """
    data = request.get_json() or {}
    
    # 验证必需字段
    required_fields = ["pet_id", "reminder_type", "due_date", "message"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"message": f"{field} is required"}), 400
    
    # 验证宠物是否存在
    pet = Pet.query.get(data.get("pet_id"))
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 验证提醒类型
    valid_types = ["vaccine", "weight", "diet", "general"]
    if data.get("reminder_type") not in valid_types:
        return jsonify({"message": f"reminder_type must be one of: {', '.join(valid_types)}"}), 400
    
    # 解析到期日期
    try:
        due_date = datetime.strptime(data.get("due_date"), "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "due_date must be YYYY-MM-DD"}), 400
    
    reminder = Reminder(
        pet_id=pet.id,
        reminder_type=data.get("reminder_type"),
        due_date=due_date,
        message=data.get("message"),
        is_sent=False
    )
    
    try:
        db.session.add(reminder)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Reminder created", "reminder": reminder.to_json()}), 201

@reminders_bp.route("/pet/<int:pet_id>", methods=["GET"])
def get_pet_reminders(pet_id):
    """
    GET /reminders/pet/<pet_id>
    optional query params: ?reminder_type=vaccine&status=active&limit=10
    """
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"message": "Pet not found"}), 404
    
    # 构建查询
    query = Reminder.query.filter_by(pet_id=pet_id)
    
    # 提醒类型过滤
    reminder_type = request.args.get("reminder_type")
    if reminder_type:
        query = query.filter_by(reminder_type=reminder_type)
    
    # 状态过滤
    status = request.args.get("status")
    if status == "active":
        query = query.filter(Reminder.due_date >= datetime.now().date())
    elif status == "overdue":
        query = query.filter(Reminder.due_date < datetime.now().date())
    elif status == "sent":
        query = query.filter_by(is_sent=True)
    elif status == "pending":
        query = query.filter_by(is_sent=False)
    
    # 限制返回数量
    limit = request.args.get("limit", type=int)
    if limit:
        query = query.limit(limit)
    
    # 排序（按到期日期升序）
    query = query.order_by(Reminder.due_date)
    
    reminders = query.all()
    return jsonify({"reminders": [reminder.to_json() for reminder in reminders]}), 200

@reminders_bp.route("/overdue", methods=["GET"])
def get_overdue_reminders():
    """
    GET /reminders/overdue
    获取所有过期的提醒
    """
    overdue_reminders = Reminder.query.filter(
        Reminder.due_date < datetime.now().date(),
        Reminder.is_sent == False
    ).order_by(Reminder.due_date).all()
    
    return jsonify({"overdue_reminders": [reminder.to_json() for reminder in overdue_reminders]}), 200

@reminders_bp.route("/due-soon", methods=["GET"])
def get_due_soon_reminders():
    """
    GET /reminders/due-soon
    获取7天内到期的提醒
    """
    today = datetime.now().date()
    seven_days_later = today + timedelta(days=7)
    
    due_soon_reminders = Reminder.query.filter(
        Reminder.due_date >= today,
        Reminder.due_date <= seven_days_later,
        Reminder.is_sent == False
    ).order_by(Reminder.due_date).all()
    
    return jsonify({"due_soon_reminders": [reminder.to_json() for reminder in due_soon_reminders]}), 200

@reminders_bp.route("/<int:reminder_id>", methods=["GET"])
def get_reminder(reminder_id):
    """
    GET /reminders/<reminder_id>
    """
    reminder = Reminder.query.get(reminder_id)
    if not reminder:
        return jsonify({"message": "Reminder not found"}), 404
    
    return jsonify({"reminder": reminder.to_json()}), 200

@reminders_bp.route("/<int:reminder_id>", methods=["PUT"])
def update_reminder(reminder_id):
    """
    PUT /reminders/<reminder_id>
    JSON body: 可包含 reminder_type, due_date, message, is_sent
    """
    reminder = Reminder.query.get(reminder_id)
    if not reminder:
        return jsonify({"message": "Reminder not found"}), 404
    
    data = request.get_json() or {}
    
    # 更新字段
    if "reminder_type" in data:
        valid_types = ["vaccine", "weight", "diet", "general"]
        if data.get("reminder_type") not in valid_types:
            return jsonify({"message": f"reminder_type must be one of: {', '.join(valid_types)}"}), 400
        reminder.reminder_type = data.get("reminder_type")
    
    if "due_date" in data:
        try:
            reminder.due_date = datetime.strptime(data.get("due_date"), "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "due_date must be YYYY-MM-DD"}), 400
    
    if "message" in data:
        reminder.message = data.get("message")
    
    if "is_sent" in data:
        reminder.is_sent = bool(data.get("is_sent"))
    
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Reminder updated", "reminder": reminder.to_json()}), 200

@reminders_bp.route("/<int:reminder_id>/mark-sent", methods=["PATCH"])
def mark_reminder_sent(reminder_id):
    """
    PATCH /reminders/<reminder_id>/mark-sent
    标记提醒为已发送
    """
    reminder = Reminder.query.get(reminder_id)
    if not reminder:
        return jsonify({"message": "Reminder not found"}), 404
    
    reminder.is_sent = True
    
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Reminder marked as sent", "reminder": reminder.to_json()}), 200

@reminders_bp.route("/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    """
    DELETE /reminders/<reminder_id>
    """
    reminder = Reminder.query.get(reminder_id)
    if not reminder:
        return jsonify({"message": "Reminder not found"}), 404
    
    try:
        db.session.delete(reminder)
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Reminder deleted"}), 200 