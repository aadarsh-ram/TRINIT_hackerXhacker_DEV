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

@app.get("/", status_code=status.HTTP_200_OK)
async def hello():
    return {"message": "Hello user! Tip: open /docs or /redoc for documentation"}

@app.get("/get-emission-stats")
async def get_emission_stats(request: Request, bytes: int, host: str):
    """Get the co2 emission of a website"""
    green = check_green_host(host)
    co2_emission = get_co2_emission(bytes, green)
    return co2_emission

if __name__ == '__main__':
    uvicorn.run("app:app", reload=True)