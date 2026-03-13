import sqlite3
import os

db_path = r'd:\project_tool\apps\processor\db\focuscast.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT error_message FROM jobs WHERE id LIKE ?", ('%a477581e%',))
row = cur.fetchone()
if row:
    print("---FULL ERROR---")
    print(row[0])
    print("---END---")
else:
    print("Job not found")
conn.close()
