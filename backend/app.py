import os
import uvicorn
from dotenv import load_dotenv
from typing import Optional
from fastapi import FastAPI, status, Response, Request, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware

from models import UserLoginSchema, UserSchema
from auth.auth_bearer import JWTBearer
from auth.auth_handler import signJWT, decodeJWT

# Import all environment variables
load_dotenv()

# Import custom modules
from db_operations import Database
from stat_utils import check_green_host, get_co2_emission
from utils import get_hashed_password, verify_password

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
async def get_emission_stats(request: Request, bytes: int, host: Optional[str] = None):
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

@app.post("/signup")
async def signup(request: Request, user: UserSchema = Body(...)):
    """Create a new user"""
    try:
        await db.add_user(user.username, get_hashed_password(user.password))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    return signJWT(user.username)

@app.post("/login")
async def login(request: Request, user: UserLoginSchema = Body(...)):
    """Login a user"""
    username = user.username
    password = user.password

    # Check if user exists
    user_exists = await db.get_user(username)
    if not user_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    # Check if password is correct
    if not verify_password(password, user_exists['password']):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    return signJWT(username)

@app.post("/save-session", dependencies=[Depends(JWTBearer())])
async def save_session(request: Request):
    """Save the session to the database"""
    data = await request.json()
    token = request.headers["authorization"].split(" ")[1]
    
    username = decodeJWT(token)["user_id"]
    session_id = data["session_id"]
    timestamp = data["timestamp"]
    total_co2_renewable_grams = data["total_co2_renewable_grams"]
    total_co2_grid_grams = data["total_co2_grid_grams"]
    total_energy_kwg = data["total_energy_kwg"]

    try:
        await db.add_session(username, session_id, timestamp, total_co2_renewable_grams, total_co2_grid_grams, total_energy_kwg)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    all_requests = data["all_requests"]
    for req in all_requests:
        timestamp = req["timestamp"]
        request_url = req["request_url"]
        co2_renewable_grams = req["co2_renewable_grams"]
        co2_grid_grams = req["co2_grid_grams"]
        energy_kwg = req["energy_kwg"]
        category = req["category"]
        await db.add_session_request(session_id, timestamp, request_url, co2_renewable_grams, co2_grid_grams, energy_kwg, category)

    return {"message": "Session saved"}

if __name__ == '__main__':
    uvicorn.run("app:app", reload=True)