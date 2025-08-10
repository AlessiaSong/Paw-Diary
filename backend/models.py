from config import db


class Contact(db.Model):
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
            "password":self.password,
            "pets":self.pets
        }

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    species = db.Column(db.String(100))   # 动物种类例如猫、狗
    breed = db.Column(db.String(100))     # 品种
    birth_date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('contact.id'), nullable=False)
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
        }

class DietLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date,
            "description": self.description
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
            "date": self.date,
            "weight_kg": self.weight_kg
        }

class VaccineLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    vaccine_type = db.Column(db.String(100))
    notes = db.Column(db.Text)

    def to_json(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "date": self.date,
            "vaccine_type": self.vaccine_type,
            "notes": self.notes
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
            "date": self.date,
            "image_url": self.image_url,
            "description": self.description
        }


