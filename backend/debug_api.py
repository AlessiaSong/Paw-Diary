#!/usr/bin/env python3
"""
API调试脚本
逐步测试各个功能
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5001"

def print_response(response, description):
    """打印响应信息"""
    print(f"\n{description}")
    print(f"状态码: {response.status_code}")
    print(f"响应头: {dict(response.headers)}")
    try:
        print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    except:
        print(f"响应内容: {response.text}")

def test_1_basic_endpoints():
    """测试基本端点"""
    print("=" * 60)
    print("🔍 测试1: 基本端点连接")
    print("=" * 60)
    
    # 测试pets端点
    response = requests.get(f"{BASE_URL}/pets/")
    print_response(response, "GET /pets/")
    
    # 测试users端点
    response = requests.get(f"{BASE_URL}/users/")
    print_response(response, "GET /users/")

def test_2_user_registration():
    """测试用户注册"""
    print("\n" + "=" * 60)
    print("👤 测试2: 用户注册")
    print("=" * 60)
    
    user_data = {
        "first_name": "测试用户",
        "last_name": "测试姓氏",
        "email": f"test_{int(datetime.now().timestamp())}@example.com",
        "password": "password123"
    }
    
    print(f"发送数据: {json.dumps(user_data, ensure_ascii=False, indent=2)}")
    
    response = requests.post(
        f"{BASE_URL}/users/register",
        json=user_data,
        headers={"Content-Type": "application/json"}
    )
    
    print_response(response, "POST /users/register")
    
    if response.status_code == 201:
        return response.json()
    return None

def test_3_user_login(user_data):
    """测试用户登录"""
    print("\n" + "=" * 60)
    print("🔑 测试3: 用户登录")
    print("=" * 60)
    
    if not user_data:
        print("跳过登录测试 - 用户数据为空")
        return None
    
    login_data = {
        "email": user_data["email"],
        "password": "password123"
    }
    
    print(f"登录数据: {json.dumps(login_data, ensure_ascii=False, indent=2)}")
    
    response = requests.post(
        f"{BASE_URL}/users/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    print_response(response, "POST /users/login")
    
    if response.status_code == 200:
        return response.json()
    return None

def test_4_create_pet(user_data):
    """测试创建宠物"""
    print("\n" + "=" * 60)
    print("🐕 测试4: 创建宠物")
    print("=" * 60)
    
    if not user_data:
        print("跳过宠物创建测试 - 用户数据为空")
        return None
    
    pet_data = {
        "user_id": user_data["id"],
        "name": "测试宠物",
        "species": "Dog",
        "breed": "Corgi",
        "birth_date": "2020-05-01"
    }
    
    print(f"宠物数据: {json.dumps(pet_data, ensure_ascii=False, indent=2)}")
    
    response = requests.post(
        f"{BASE_URL}/pets/",
        json=pet_data,
        headers={"Content-Type": "application/json"}
    )
    
    print_response(response, "POST /pets/")
    
    if response.status_code == 201:
        return response.json()["pet"]
    return None

def test_5_create_diet_log(pet_data):
    """测试创建饮食记录"""
    print("\n" + "=" * 60)
    print("🍽️ 测试5: 创建饮食记录")
    print("=" * 60)
    
    if not pet_data:
        print("跳过饮食记录测试 - 宠物数据为空")
        return None
    
    diet_data = {
        "pet_id": pet_data["id"],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "description": "测试狗粮",
        "meal_type": "早餐",
        "food_amount": 100.0,
        "unit": "克",
        "feeding_time": "08:00"
    }
    
    print(f"饮食数据: {json.dumps(diet_data, ensure_ascii=False, indent=2)}")
    
    response = requests.post(
        f"{BASE_URL}/diet-logs/",
        json=diet_data,
        headers={"Content-Type": "application/json"}
    )
    
    print_response(response, "POST /diet-logs/")
    
    if response.status_code == 201:
        return response.json()["diet_log"]
    return None

def test_6_create_weight_log(pet_data):
    """测试创建体重记录"""
    print("\n" + "=" * 60)
    print("⚖️ 测试6: 创建体重记录")
    print("=" * 60)
    
    if not pet_data:
        print("跳过体重记录测试 - 宠物数据为空")
        return None
    
    weight_data = {
        "pet_id": pet_data["id"],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "weight_kg": 25.5
    }
    
    print(f"体重数据: {json.dumps(weight_data, ensure_ascii=False, indent=2)}")
    
    response = requests.post(
        f"{BASE_URL}/weight-logs/",
        json=weight_data,
        headers={"Content-Type": "application/json"}
    )
    
    print_response(response, "POST /weight-logs/")
    
    if response.status_code == 201:
        return response.json()["weight_log"]
    return None

def test_7_create_vaccine_log(pet_data):
    """测试创建疫苗记录"""
    print("\n" + "=" * 60)
    print("💉 测试7: 创建疫苗记录")
    print("=" * 60)
    
    if not pet_data:
        print("跳过疫苗记录测试 - 宠物数据为空")
        return None
    
    vaccine_data = {
        "pet_id": pet_data["id"],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "vaccine_type": "狂犬疫苗",
        "notes": "第一针",
        "next_due_date": "2025-01-15",
        "reminder_enabled": True
    }
    
    print(f"疫苗数据: {json.dumps(vaccine_data, ensure_ascii=False, indent=2)}")
    
    response = requests.post(
        f"{BASE_URL}/vaccine-logs/",
        json=vaccine_data,
        headers={"Content-Type": "application/json"}
    )
    
    print_response(response, "POST /vaccine-logs/")
    
    if response.status_code == 201:
        return response.json()["vaccine_log"]
    return None

def test_8_create_reminder(pet_data):
    """测试创建提醒"""
    print("\n" + "=" * 60)
    print("🔔 测试8: 创建提醒")
    print("=" * 60)
    
    if not pet_data:
        print("跳过提醒测试 - 宠物数据为空")
        return None
    
    reminder_data = {
        "pet_id": pet_data["id"],
        "reminder_type": "vaccine",
        "due_date": "2024-02-15",
        "message": "疫苗到期提醒"
    }
    
    print(f"提醒数据: {json.dumps(reminder_data, ensure_ascii=False, indent=2)}")
    
    response = requests.post(
        f"{BASE_URL}/reminders/",
        json=reminder_data,
        headers={"Content-Type": "application/json"}
    )
    
    print_response(response, "POST /reminders/")
    
    if response.status_code == 201:
        return response.json()["reminder"]
    return None

def test_9_query_functions(pet_data):
    """测试查询功能"""
    print("\n" + "=" * 60)
    print("🔍 测试9: 查询功能")
    print("=" * 60)
    
    if not pet_data:
        print("跳过查询测试 - 宠物数据为空")
        return
    
    # 测试饮食记录查询
    print("查询饮食记录...")
    response = requests.get(f"{BASE_URL}/diet-logs/pet/{pet_data['id']}")
    print_response(response, "GET /diet-logs/pet/{pet_id}")
    
    # 测试体重记录查询
    print("查询体重记录...")
    response = requests.get(f"{BASE_URL}/weight-logs/pet/{pet_data['id']}")
    print_response(response, "GET /weight-logs/pet/{pet_id}")
    
    # 测试疫苗记录查询
    print("查询疫苗记录...")
    response = requests.get(f"{BASE_URL}/vaccine-logs/pet/{pet_data['id']}")
    print_response(response, "GET /vaccine-logs/pet/{pet_id}")
    
    # 测试提醒查询
    print("查询提醒...")
    response = requests.get(f"{BASE_URL}/reminders/pet/{pet_data['id']}")
    print_response(response, "GET /reminders/pet/{pet_id}")
    
    # 测试特殊查询
    print("查询即将到期的疫苗...")
    response = requests.get(f"{BASE_URL}/vaccine-logs/pet/{pet_data['id']}/upcoming")
    print_response(response, "GET /vaccine-logs/pet/{pet_id}/upcoming")
    
    print("查询即将到期的提醒...")
    response = requests.get(f"{BASE_URL}/reminders/due-soon")
    print_response(response, "GET /reminders/due-soon")

def main():
    """主函数"""
    print("🚀 开始API调试测试...")
    
    # 测试1: 基本端点
    test_1_basic_endpoints()
    
    # 测试2: 用户注册
    user = test_2_user_registration()
    
    # 测试3: 用户登录
    logged_user = test_3_user_login(user)
    
    # 测试4: 创建宠物
    pet = test_4_create_pet(logged_user or user)
    
    # 测试5: 创建饮食记录
    diet_log = test_5_create_diet_log(pet)
    
    # 测试6: 创建体重记录
    weight_log = test_6_create_weight_log(pet)
    
    # 测试7: 创建疫苗记录
    vaccine_log = test_7_create_vaccine_log(pet)
    
    # 测试8: 创建提醒
    reminder = test_8_create_reminder(pet)
    
    # 测试9: 查询功能
    test_9_query_functions(pet)
    
    print("\n" + "=" * 60)
    print("🎉 调试测试完成!")
    print("=" * 60)
    
    if user:
        print(f"✅ 用户创建成功: {user['email']}")
    if logged_user:
        print(f"✅ 用户登录成功: {logged_user['email']}")
    if pet:
        print(f"✅ 宠物创建成功: {pet['name']}")
    if diet_log:
        print(f"✅ 饮食记录创建成功: {diet_log['description']}")
    if weight_log:
        print(f"✅ 体重记录创建成功: {weight_log['weight_kg']}kg")
    if vaccine_log:
        print(f"✅ 疫苗记录创建成功: {vaccine_log['vaccine_type']}")
    if reminder:
        print(f"✅ 提醒创建成功: {reminder['message']}")

if __name__ == "__main__":
    main() 