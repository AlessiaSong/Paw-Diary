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
    color = db.Column(db.String(100))     # 毛色
    microchip_id = db.Column(db.String(100))  # 芯片ID
    notes = db.Column(db.Text)            # 备注
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
            "color": self.color,
            "microchip_id": self.microchip_id,
            "notes": self.notes,
            "user_id": self.user_id
        }

class DietLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.String(200), nullable=False)  # 食物描述
    food_amount = db.Column(db.Float)  # 食物数量
    unit = db.Column(db.String(20))  # 单位 (g, kg, cups, etc.)
    meal_type = db.Column(db.String(50))  # 餐次类型 (breakfast, lunch, dinner, snack)
    notes = db.Column(db.Text)  # 备注

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "description": self.description,
            "food_amount": self.food_amount,
            "unit": self.unit,
            "meal_type": self.meal_type,
            "notes": self.notes
        }

class WeightLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    weight_kg = db.Column(db.Float, nullable=False)  # 体重（公斤）
    notes = db.Column(db.Text)  # 备注

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "weight_kg": self.weight_kg,
            "notes": self.notes
        }

class VaccineLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    vaccine_type = db.Column(db.String(100), nullable=False)  # 疫苗类型
    next_due_date = db.Column(db.Date)  # 下次接种日期
    notes = db.Column(db.Text)  # 备注

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "vaccine_type": self.vaccine_type,
            "next_due_date": self.next_due_date.strftime("%Y-%m-%d") if self.next_due_date else None,
            "notes": self.notes
        }

class PetGrowthLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    height_cm = db.Column(db.Float)  # 身高（厘米）
    length_cm = db.Column(db.Float)  # 体长（厘米）
    notes = db.Column(db.Text)  # 备注

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "height_cm": self.height_cm,
            "length_cm": self.length_cm,
            "notes": self.notes
        }

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date, nullable=False)
    reminder_type = db.Column(db.String(50))  # 提醒类型 (vaccine, checkup, medication, etc.)
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date.strftime("%Y-%m-%d") if self.due_date else None,
            "reminder_type": self.reminder_type,
            "is_completed": self.is_completed,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }
