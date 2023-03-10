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
        await self.database.execute(query="CREATE TABLE IF NOT EXISTS user_sessions (username VARCHAR(50), session_id TEXT UNIQUE, timestamp TIMESTAMP, total_co2_renewable_grams NUMERIC(14, 10), total_co2_grid_grams NUMERIC(14, 10), total_energy_kwg REAL, green_category TEXT);")
        await self.database.execute(query="CREATE TABLE IF NOT EXISTS session_requests (session_id TEXT, timestamp TIMESTAMP, request_url TEXT, co2_renewable_grams NUMERIC(14, 10), co2_grid_grams NUMERIC(14, 10), energy_kwg REAL, category TEXT);")

    async def get_user(self, username):
        query = "SELECT username, password FROM user_accounts WHERE username = :username"
        values = {"username": username}
        return await self.database.fetch_one(query=query, values=values)
    
    async def add_user(self, username, password):
        query = "INSERT INTO user_accounts (username, password) VALUES (:username, :password)"
        values = {"username": username, "password": password}
        await self.database.execute(query=query, values=values)
    
    async def add_session(self, username, session_id, timestamp, total_co2_renewable_grams, total_co2_grid_grams, total_energy_kwg, green_category):
        query = "INSERT INTO user_sessions (username, session_id, timestamp, total_co2_renewable_grams, total_co2_grid_grams, total_energy_kwg, green_category) VALUES (:username, :session_id, :timestamp, :total_co2_renewable_grams, :total_co2_grid_grams, :total_energy_kwg, :green_category)"
        values = {
            "username": username,
            "session_id": session_id,
            "timestamp": datetime.fromisoformat(timestamp),
            "total_co2_renewable_grams": total_co2_renewable_grams,
            "total_co2_grid_grams": total_co2_grid_grams,
            "total_energy_kwg": total_energy_kwg,
            "green_category": green_category
        }
        await self.database.execute(query=query, values=values)

    async def add_session_request(self, session_id, timestamp, request_url, co2_renewable_grams, co2_grid_grams, energy_kwg, category):
        query = "INSERT INTO session_requests (session_id, timestamp, request_url, co2_renewable_grams, co2_grid_grams, energy_kwg, category) VALUES (:session_id, :timestamp, :request_url, :co2_renewable_grams, :co2_grid_grams, :energy_kwg, :category)"
        values = {
            "session_id": session_id,
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
        query = "SELECT session_id, green_category, timestamp FROM user_sessions WHERE username=:username ORDER BY timestamp DESC;"
        values = {
            "username": username
        }
        return await self.database.fetch_all(query=query, values=values)
    
    async def fetch_user_stats(self, username):
        query = """
            SELECT SUM(total_co2_renewable_grams) AS user_co2_renewable_grams, SUM(total_co2_grid_grams) AS user_co2_grid_grams, SUM(total_energy_kwg) AS user_energy_kwg
            FROM user_sessions WHERE username=:username
        """
        values = {
            "username": username
        }
        return await self.database.fetch_one(query=query, values=values)
  
    async def website_search(self, search_term):
        query = """
            SELECT request_url, category FROM session_requests 
            WHERE request_url LIKE :search_term 
            UNION 
            SELECT :website, 'unknown' 
            WHERE NOT EXISTS (SELECT 1 FROM session_requests WHERE request_url LIKE :search_term);
        """
        values = {
            "search_term": f"%{search_term}%",
            "website": search_term
        }
        return await self.database.fetch_one(query=query, values=values)