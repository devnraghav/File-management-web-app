# cool lib for colored console output
from colorama import Fore
from fastapi import FastAPI, Request, Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
# importing all our endpoints
# auth
from api.endpoints import auth, dashboard


# creating our app instance
app = FastAPI()

# setting up CORS

# origins
origins = [
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# fuck the prefix
# including all our endpoints
app.include_router(auth.auth_router)
app.include_router(dashboard.dashboard_router)
