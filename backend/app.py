import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware

# Import custom modules
from db_operations import Database
from stat_utils import check_green_host, get_co2_emission

# Import all environment variables
load_dotenv()

# Postgres database variables
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")

# Initialize database
db = Database(host=db_host, user=db_user, password=db_password, database=db_name)
app = FastAPI()

# Allow anyone to call the API from their own apps
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db.dbs_connect()
    await db.create_tables()

@app.on_event("shutdown")
async def shutdown():
    await db.dbs_disconnect()

# Get routes

@app.get("/", status_code=status.HTTP_200_OK)
async def hello():
    return {"message": "Hello user! Tip: open /docs or /redoc for documentation"}

@app.get("/get-emission-stats")
async def get_emission_stats(request: Request, bytes: int, host: str):
    """Get the co2 emission of a website"""
    green = check_green_host(host)
    co2_emission = get_co2_emission(bytes, green)
    return co2_emission

@app.get("/get-user-sessions")
async def get_user_sessions(request: Request, username: str):
    """Get all sessions from a user"""
    sessions = await db.fetch_user_sessions(username)
    return sessions

@app.get("/get-session")
async def get_session(request: Request, session_id: str):
    """Get the session from the database"""
    session = await db.fetch_session(session_id)
    return session

# Post routes

@app.post("/save-session")
async def save_session(request: Request):
    """Save the session to the database"""
    data = await request.json()
    username = data["username"]
    session_id = data["session_id"]
    timestamp = data["timestamp"]

    all_requests = data["all_requests"]
    for req in all_requests:
        request_url = req["request_url"]
        co2_renewable_grams = req["co2_renewable_grams"]
        co2_grid_grams = req["co2_grid_grams"]
        energy_kwg = req["energy_kwg"]
        category = req["category"]
        await db.add_session(session_id, username, timestamp, request_url, co2_renewable_grams, co2_grid_grams, energy_kwg, category)

    return {"message": "Session saved"}

if __name__ == '__main__':
    uvicorn.run("app:app", reload=True)