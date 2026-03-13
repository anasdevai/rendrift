import sqlite3
import os
from pathlib import Path
from datetime import datetime

# Get absolute path to database
DB_PATH = os.environ.get("DB_PATH", "../db/focuscast.db")
if not os.path.isabs(DB_PATH):
    # Make it relative to the agent directory
    DB_PATH = str(Path(__file__).parent.parent.parent / DB_PATH.lstrip('./'))

def get_db_connection():
    """Get a connection to the SQLite database."""
    return sqlite3.connect(DB_PATH)

def update_job_in_db(job_id: str, status: str, current_step: str, 
                     output_path: str = None, error_message: str = None,
                     render_script: str = None, token_used: int = None):
    """
    Updates the job status in SQLite.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    update_fields = []
    params = []
    
    update_fields.append("status = ?")
    params.append(status)
    
    update_fields.append("current_step = ?")
    params.append(current_step)
    
    if output_path:
        update_fields.append("output_path = ?")
        params.append(output_path)
    
    if error_message:
        update_fields.append("error_message = ?")
        params.append(error_message)
    
    if render_script:
        update_fields.append("render_script = ?")
        params.append(render_script)
    
    if token_used is not None:
        update_fields.append("token_used = ?")
        params.append(token_used)
    
    update_fields.append("updated_at = datetime('now')")
    params.append(job_id)
    
    query = f"UPDATE jobs SET {', '.join(update_fields)} WHERE id = ?"
    
    cursor.execute(query, params)
    conn.commit()
    conn.close()
