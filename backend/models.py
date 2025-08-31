from config import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120),unique=False,nullable=False)
    pets = db.relationship('Pet', backref='owner', lazy=True)
    #是否创建一个以email为key的password字典
    
    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
            "password": self.password,
            "pets": [pet.to_json() for pet in self.pets]  # 改这里
        }


class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    species = db.Column(db.String(100))   # 动物种类例如猫、狗
    breed = db.Column(db.String(100))     # 品种
    birth_date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    diet_logs = db.relationship('DietLog', backref='pet', lazy=True)
    weight_logs = db.relationship('WeightLog', backref='pet', lazy=True)
    vaccine_logs = db.relationship('VaccineLog', backref='pet', lazy=True)  # 疫苗接种记录  
    growth_logs = db.relationship('PetGrowthLog', backref='pet', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "species": self.species,
            "breed": self.breed,
            "birth_date": self.birth_date.strftime("%Y-%m-%d") if self.birth_date else None,
            "user_id": self.user_id
        }

class DietLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)
    meal_type = db.Column(db.String(50))      # 早餐/午餐/晚餐/零食
    food_amount = db.Column(db.Float)         # 食物量
    unit = db.Column(db.String(20))           # 单位(克/杯等)
    feeding_time = db.Column(db.Time)         # 喂食时间

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "description": self.description,
            "meal_type": self.meal_type,
            "food_amount": self.food_amount,
            "unit": self.unit,
            "feeding_time": self.feeding_time.strftime("%H:%M") if self.feeding_time else None
        }

class WeightLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    weight_kg = db.Column(db.Float)

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "weight_kg": self.weight_kg
        }

class VaccineLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    vaccine_type = db.Column(db.String(100))
    notes = db.Column(db.Text)
    next_due_date = db.Column(db.Date)        # 下次接种日期
    reminder_enabled = db.Column(db.Boolean, default=True)  # 是否启用提醒

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "vaccine_type": self.vaccine_type,
            "notes": self.notes,
            "next_due_date": self.next_due_date.strftime("%Y-%m-%d") if self.next_due_date else None,
            "reminder_enabled": self.reminder_enabled
        }

class PetGrowthLog(db.Model):
    __tablename__ = 'pet_growth_log'

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    image_url = db.Column(db.String(255))  # 存储图像路径
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d %H:%M:%S") if self.date else None,
            "image_url": self.image_url,
            "description": self.description,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }

# 需要添加的通知模型
class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'))
    reminder_type = db.Column(db.String(50))  # vaccine, weight, diet
    due_date = db.Column(db.Date)
    message = db.Column(db.Text)
    is_sent = db.Column(db.Boolean, default=False)
    
    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "reminder_type": self.reminder_type,
            "due_date": self.due_date.strftime("%Y-%m-%d") if self.due_date else None,
            "message": self.message,
            "is_sent": self.is_sent
        }


