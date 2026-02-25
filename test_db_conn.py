
import os
import django
import pymysql
from dotenv import load_dotenv

load_dotenv()

print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {'SET' if os.getenv('DB_PASSWORD') else 'EMPTY'}")

try:
    conn = pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'tuteur_db'),
        port=int(os.getenv('DB_PORT', 3306))
    )
    print("✅ Connection successful!")
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    print(f"Tables found: {len(tables)}")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")
