import databases

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
        await self.database.execute(query="CREATE TABLE IF NOT EXISTS user_sessions (username VARCHAR(50) PRIMARY KEY, session_id TEXT);")
        await self.database.execute(query="CREATE TABLE IF NOT EXISTS session_requests (username VARCHAR(50) PRIMARY KEY, session_id TEXT, request_url TEXT, co2 TEXT, energy TEXT, cleaner_than TEXT);")