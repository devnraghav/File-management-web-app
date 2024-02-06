from colorama import Fore
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
# for token expiring
from datetime import datetime, timedelta

SECRET_KEY = ""
ALGORITHM = ""
ACCESS_TOKEN_EXPIRE_MINS = 0

auth_router = APIRouter()

fake_db = {
    "raghav": {
        "UID": 1234,
        "full_name": "Sam Williams",
        "email": "SamWilliams@gmail.com",
        "hashed_pass": "",
        "disabled": False
    }   
}

class User(BaseModel):
    UID: int or None = None # making this optional because we will generate a new UID for our user.
    user_email: str
    user_pass: str

# two routes for our auth


# using Request and Response objects in auth routes for security reasons.
@auth_router.post("/register")
async def register(req: Request, res: Response):
    pass


@auth_router.post("/login")
async def login(request: Request, res: Response):
    try:
        req = await request.json()

        print(req)


        return req
    except:
        return "error!"
