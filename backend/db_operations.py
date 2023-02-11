import databases
from datetime import datetime

class Database:
    def __init__(self, host, user, password, database):
        self.DATABASE_URL = f'postgresql+psycopg2://{user}:{password}@{host}:5432/{database}'
        self.database = databases.Database(self.DATABASE_URL)
    
    async def dbs_connect(self):
        await self.database.connect()
        print ("Connected to database")
    
    async def dbs_disconnect(self):
        await self.database.disconnect()
        print ("Disconnected from database")
    
    async def create_tables(self):
        await self.database.execute(query="CREATE TABLE IF NOT EXISTS user_accounts (username VARCHAR(50) PRIMARY KEY, password VARCHAR(200));")
        await self.database.execute(query="CREATE TABLE IF NOT EXISTS session_requests (session_id TEXT, username VARCHAR(50), timestamp TIMESTAMP, request_url TEXT, co2_renewable_grams TEXT, co2_grid_grams TEXT, energy_kwg TEXT, category TEXT);")
    
    async def add_session(self, session_id, username, timestamp, request_url, co2_renewable_grams, co2_grid_grams, energy_kwg, category):
        query = "INSERT INTO session_requests (session_id, username, timestamp, request_url, co2_renewable_grams, co2_grid_grams, energy_kwg, category) VALUES (:session_id, :username, :timestamp, :request_url, :co2_renewable_grams, :co2_grid_grams, :energy_kwg, :category)"
        values = {
            "session_id": session_id,
            "username": username,
            "timestamp": datetime.fromisoformat(timestamp),
            "request_url": request_url,
            "co2_renewable_grams": co2_renewable_grams,
            "co2_grid_grams": co2_grid_grams,
            "energy_kwg": energy_kwg,
            "category": category
        }
        await self.database.execute(query=query, values=values)
    
    async def fetch_session(self, session_id):
        query = "SELECT * FROM session_requests WHERE session_id=:session_id"
        values = {
            "session_id": session_id
        }
        return await self.database.fetch_all(query=query, values=values)
    
    async def fetch_user_sessions(self, username):
        query = "SELECT distinct(session_id), timestamp FROM session_requests WHERE username=:username ORDER BY timestamp DESC;"
        values = {
            "username": username
        }
        return await self.database.fetch_all(query=query, values=values)