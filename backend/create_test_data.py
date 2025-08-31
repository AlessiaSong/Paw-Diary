#!/usr/bin/env python3
"""
创建测试数据脚本
帮助快速创建测试数据来验证API功能
"""

import requests
import json
from datetime import datetime, timedelta
import random

# 配置
BASE_URL = "http://localhost:5001"
HEADERS = {"Content-Type": "application/json"}

def create_test_user():
    """创建测试用户"""
    user_data = {
        "first_name": "测试",
        "last_name": "用户",
        "email": f"testuser_{int(datetime.now().timestamp())}@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/users/register", json=user_data, headers=HEADERS)
    if response.status_code == 201:
        user = response.json()
        print(f"✅ 创建用户成功: {user['firstName']} {user['lastName']} (ID: {user['id']})")
        return user
    else:
        print(f"❌ 创建用户失败: {response.text}")
        return None

def create_test_pet(user_id):
    """创建测试宠物"""
    pet_data = {
        "user_id": user_id,
        "name": "小柯基",
        "species": "Dog",
        "breed": "Corgi",
        "birth_date": "2020-05-01"
    }
    
    response = requests.post(f"{BASE_URL}/pets/", json=pet_data, headers=HEADERS)
    if response.status_code == 201:
        pet = response.json()["pet"]
        print(f"✅ 创建宠物成功: {pet['name']} (ID: {pet['id']})")
        return pet
    else:
        print(f"❌ 创建宠物失败: {response.text}")
        return None

def create_diet_logs(pet_id, count=5):
    """创建饮食记录"""
    meal_types = ["早餐", "午餐", "晚餐", "零食"]
    foods = ["狗粮", "鸡肉", "牛肉", "蔬菜", "水果"]
    units = ["克", "杯", "块", "片"]
    
    for i in range(count):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        diet_data = {
            "pet_id": pet_id,
            "date": date,
            "description": random.choice(foods),
            "meal_type": random.choice(meal_types),
            "food_amount": round(random.uniform(50, 200), 1),
            "unit": random.choice(units),
            "feeding_time": f"{random.randint(6, 22):02d}:{random.randint(0, 59):02d}"
        }
        
        response = requests.post(f"{BASE_URL}/diet-logs/", json=diet_data, headers=HEADERS)
        if response.status_code == 201:
            print(f"✅ 创建饮食记录 {i+1}: {diet_data['description']} ({diet_data['date']})")
        else:
            print(f"❌ 创建饮食记录失败: {response.text}")

def create_weight_logs(pet_id, count=7):
    """创建体重记录"""
    base_weight = 25.0
    
    for i in range(count):
        date = (datetime.now() - timedelta(days=i*3)).strftime("%Y-%m-%d")
        # 模拟体重变化
        weight_change = random.uniform(-0.5, 0.5)
        weight_data = {
            "pet_id": pet_id,
            "date": date,
            "weight_kg": round(base_weight + weight_change, 1)
        }
        
        response = requests.post(f"{BASE_URL}/weight-logs/", json=weight_data, headers=HEADERS)
        if response.status_code == 201:
            print(f"✅ 创建体重记录 {i+1}: {weight_data['weight_kg']}kg ({weight_data['date']})")
        else:
            print(f"❌ 创建体重记录失败: {response.text}")

def create_vaccine_logs(pet_id, count=3):
    """创建疫苗记录"""
    vaccine_types = ["狂犬疫苗", "三联疫苗", "六联疫苗", "狂犬疫苗加强针"]
    
    for i in range(count):
        date = (datetime.now() - timedelta(days=i*30)).strftime("%Y-%m-%d")
        next_due_date = (datetime.now() + timedelta(days=365-i*30)).strftime("%Y-%m-%d")
        
        vaccine_data = {
            "pet_id": pet_id,
            "date": date,
            "vaccine_type": vaccine_types[i % len(vaccine_types)],
            "notes": f"第{i+1}针",
            "next_due_date": next_due_date,
            "reminder_enabled": True
        }
        
        response = requests.post(f"{BASE_URL}/vaccine-logs/", json=vaccine_data, headers=HEADERS)
        if response.status_code == 201:
            print(f"✅ 创建疫苗记录 {i+1}: {vaccine_data['vaccine_type']} ({vaccine_data['date']})")
        else:
            print(f"❌ 创建疫苗记录失败: {response.text}")

def create_reminders(pet_id, count=4):
    """创建提醒"""
    reminder_types = ["vaccine", "weight", "diet", "general"]
    messages = [
        "疫苗到期提醒",
        "体重检查提醒", 
        "定期喂食提醒",
        "健康检查提醒"
    ]
    
    for i in range(count):
        due_date = (datetime.now() + timedelta(days=random.randint(7, 90))).strftime("%Y-%m-%d")
        
        reminder_data = {
            "pet_id": pet_id,
            "reminder_type": reminder_types[i % len(reminder_types)],
            "due_date": due_date,
            "message": messages[i % len(messages)]
        }
        
        response = requests.post(f"{BASE_URL}/reminders/", json=reminder_data, headers=HEADERS)
        if response.status_code == 201:
            print(f"✅ 创建提醒 {i+1}: {reminder_data['message']} ({reminder_data['due_date']})")
        else:
            print(f"❌ 创建提醒失败: {response.text}")

def main():
    """主函数"""
    print("=" * 60)
    print("🐾 Paw Diary 测试数据生成工具")
    print("=" * 60)
    
    # 检查后端服务是否运行
    try:
        response = requests.get(f"{BASE_URL}/pets/", timeout=5)
        if response.status_code != 200:
            print("❌ 后端服务响应异常")
            return
    except requests.exceptions.RequestException:
        print("❌ 无法连接到后端服务，请确保后端正在运行")
        print("   运行命令: cd backend && python main.py")
        return
    
    print("✅ 后端服务正在运行")
    print()
    
    # 创建测试数据
    print("🚀 开始创建测试数据...")
    print()
    
    # 1. 创建用户
    user = create_test_user()
    if not user:
        print("❌ 无法创建用户，停止创建测试数据")
        return
    
    print()
    
    # 2. 创建宠物
    pet = create_test_pet(user["id"])
    if not pet:
        print("❌ 无法创建宠物，停止创建测试数据")
        return
    
    print()
    
    # 3. 创建饮食记录
    print("🍽️ 创建饮食记录...")
    create_diet_logs(pet["id"])
    print()
    
    # 4. 创建体重记录
    print("⚖️ 创建体重记录...")
    create_weight_logs(pet["id"])
    print()
    
    # 5. 创建疫苗记录
    print("💉 创建疫苗记录...")
    create_vaccine_logs(pet["id"])
    print()
    
    # 6. 创建提醒
    print("🔔 创建提醒...")
    create_reminders(pet["id"])
    print()
    
    print("=" * 60)
    print("🎉 测试数据创建完成!")
    print("=" * 60)
    print(f"用户ID: {user['id']}")
    print(f"宠物ID: {pet['id']}")
    print()
    print("现在你可以:")
    print("1. 运行测试脚本: python test_api.py")
    print("2. 使用Postman测试各个API端点")
    print("3. 查看数据库中的数据")
    print("=" * 60)

if __name__ == "__main__":
    main() 