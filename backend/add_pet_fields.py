#!/usr/bin/env python3
"""
数据库迁移脚本：为Pet模型添加color、microchip_id和notes字段
"""

from config import app, db

def add_pet_fields():
    with app.app_context():
        try:
            # 使用SQLAlchemy 2.0语法
            with db.engine.connect() as conn:
                # 添加color字段
                try:
                    conn.execute(db.text("ALTER TABLE pet ADD COLUMN color VARCHAR(100)"))
                    conn.commit()
                    print("✅ Added color field")
                except Exception as e:
                    print(f"⚠️  Color field might already exist: {e}")
                
                # 添加microchip_id字段
                try:
                    conn.execute(db.text("ALTER TABLE pet ADD COLUMN microchip_id VARCHAR(100)"))
                    conn.commit()
                    print("✅ Added microchip_id field")
                except Exception as e:
                    print(f"⚠️  Microchip_id field might already exist: {e}")
                
                # 添加notes字段
                try:
                    conn.execute(db.text("ALTER TABLE pet ADD COLUMN notes TEXT"))
                    conn.commit()
                    print("✅ Added notes field")
                except Exception as e:
                    print(f"⚠️  Notes field might already exist: {e}")
        except Exception as e:
            print(f"❌ Migration failed: {e}")
        
        print("🎉 Database migration completed!")

if __name__ == "__main__":
    add_pet_fields()
