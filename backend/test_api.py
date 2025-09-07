#!/usr/bin/env python3
"""
简单的API测试脚本
用于验证后端API是否正常工作
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5001"

def test_users_api():
    """测试用户API"""
    print("测试用户API...")
    
    # 获取用户列表
    try:
        response = requests.get(f"{BASE_URL}/users/")
        if response.status_code == 200:
            print("✅ 获取用户列表成功")
            users = response.json().get('users', [])
            print(f"   找到 {len(users)} 个用户")
            return users
        else:
            print(f"❌ 获取用户列表失败: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ 获取用户列表出错: {e}")
        return []

def test_pets_api(users):
    """测试宠物API"""
    print("\n测试宠物API...")
    
    if not users:
        print("❌ 没有用户，跳过宠物测试")
        return []
    
    user_id = users[0]['id']
    
    # 获取用户的宠物
    try:
        response = requests.get(f"{BASE_URL}/pets/?user_id={user_id}")
        if response.status_code == 200:
            print("✅ 获取宠物列表成功")
            pets = response.json().get('pets', [])
            print(f"   找到 {len(pets)} 个宠物")
            return pets
        else:
            print(f"❌ 获取宠物列表失败: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ 获取宠物列表出错: {e}")
        return []

def test_create_pet(users):
    """测试创建宠物"""
    print("\n测试创建宠物...")
    
    if not users:
        print("❌ 没有用户，跳过创建宠物测试")
        return None
    
    user_id = users[0]['id']
    
    pet_data = {
        "user_id": user_id,
        "name": "测试宠物",
        "species": "dog",
        "breed": "金毛",
        "gender": "male",
        "birth_date": "2020-01-01",
        "weight": 25.5,
        "color": "金色",
        "notes": "这是一个测试宠物"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/pets/", json=pet_data)
        if response.status_code == 201:
            print("✅ 创建宠物成功")
            pet = response.json().get('pet')
            print(f"   宠物ID: {pet['id']}")
            return pet
        else:
            print(f"❌ 创建宠物失败: {response.status_code}")
            print(f"   错误信息: {response.text}")
            return None
    except Exception as e:
        print(f"❌ 创建宠物出错: {e}")
        return None

def test_weight_logs(pets):
    """测试体重记录API"""
    print("\n测试体重记录API...")
    
    if not pets:
        print("❌ 没有宠物，跳过体重记录测试")
        return
    
    pet_id = pets[0]['id']
    
    # 获取体重记录
    try:
        response = requests.get(f"{BASE_URL}/weight-logs/pet/{pet_id}")
        if response.status_code == 200:
            print("✅ 获取体重记录成功")
            logs = response.json().get('weight_logs', [])
            print(f"   找到 {len(logs)} 条体重记录")
        else:
            print(f"❌ 获取体重记录失败: {response.status_code}")
    except Exception as e:
        print(f"❌ 获取体重记录出错: {e}")

def test_diet_logs(pets):
    """测试饮食记录API"""
    print("\n测试饮食记录API...")
    
    if not pets:
        print("❌ 没有宠物，跳过饮食记录测试")
        return
    
    pet_id = pets[0]['id']
    
    # 获取饮食记录
    try:
        response = requests.get(f"{BASE_URL}/diet-logs/pet/{pet_id}")
        if response.status_code == 200:
            print("✅ 获取饮食记录成功")
            logs = response.json().get('diet_logs', [])
            print(f"   找到 {len(logs)} 条饮食记录")
        else:
            print(f"❌ 获取饮食记录失败: {response.status_code}")
    except Exception as e:
        print(f"❌ 获取饮食记录出错: {e}")

def test_vaccine_logs(pets):
    """测试疫苗记录API"""
    print("\n测试疫苗记录API...")
    
    if not pets:
        print("❌ 没有宠物，跳过疫苗记录测试")
        return
    
    pet_id = pets[0]['id']
    
    # 获取疫苗记录
    try:
        response = requests.get(f"{BASE_URL}/vaccine-logs/pet/{pet_id}")
        if response.status_code == 200:
            print("✅ 获取疫苗记录成功")
            logs = response.json().get('vaccine_logs', [])
            print(f"   找到 {len(logs)} 条疫苗记录")
        else:
            print(f"❌ 获取疫苗记录失败: {response.status_code}")
    except Exception as e:
        print(f"❌ 获取疫苗记录出错: {e}")

def main():
    """主函数"""
    print("开始API测试...")
    print("=" * 50)
    
    # 测试用户API
    users = test_users_api()
    
    # 测试宠物API
    pets = test_pets_api(users)
    
    # 测试创建宠物
    if not pets:
        new_pet = test_create_pet(users)
        if new_pet:
            pets = [new_pet]
    
    # 测试各种记录API
    if pets:
        test_weight_logs(pets)
        test_diet_logs(pets)
        test_vaccine_logs(pets)
    
    print("\n" + "=" * 50)
    print("API测试完成！")

if __name__ == "__main__":
    main() 