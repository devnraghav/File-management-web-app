# from colorama import Fore
# from fastapi import APIRouter, Depends, HTTPException, Header
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from pydantic import BaseModel
# from datetime import datetime, timedelta
# import jwt
# # from typing import Optional
# SECRET_KEY = "y_9tC5OEZIj5B14oDVrNKPcNxF3vk0Y0F_YppRReJjI"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_DAYS = 1

# auth_router = APIRouter()

# fake_db = {
#     1: {
#         "email": "samwilliams@gmail.com",
#         "hashed_pass": "password123",
#         "disabled": False
#     }
# }

# class User(BaseModel):
#     # setting token as optional 
#     # This is because if no token is received while the user tries to log in, then we can generate a new one or say invalid
#     email: str
#     password: str


# # function to check if a user's email already exists on our database for login and register purposes.
# def user_exists(email, password, auth_type):
#     for user_id in fake_db.values(): 
#         if auth_type == "login":
#             if email == user_id.get("email") and password == user_id.get("hashed_pass"):
#                 return True

#         if auth_type == "register":
#             if email == user_id.get("email"):
#                 return True
#     return False


# # for registeration only
# # UID = User ID
# def generate_new_UID():
#     # get all the current user ids (key values).
#     current_user_ids = fake_db.keys()
#     # get the highest or maximum user id from our current user ids.
#     max_current_user_id = max(current_user_ids)
#     # check if our database is empty.
#     # if so, set the max user id to 0 by default.
#     if not current_user_ids:
#         max_current_user_id = 0
#     # generate a new user id by incrementing the maximum or highest user id by 1.
#     generate_user_id = max_current_user_id + 1

#     # return our newly generated user id.
#     return generate_user_id

# def create_new_access_token(user_id, expire_delta):

#     # adding expiry datetime
#     now = datetime.utcnow()
#     future = now + expire_delta

#     data = {
#         "UID": user_id,
#         "exp": future
#     }

#     token = jwt.encode(data, key=SECRET_KEY, algorithm=ALGORITHM)

#     return token


# extract_jwt_token = OAuth2PasswordBearer(tokenUrl="/login")

# def is_token_valid(token: str):
#     pass



# @auth_router.post("/login")
# async def login(data: User, Authorization: str = Header(None)):

#     # setting auth_type for user_exists() method
#     auth_type = "login"

#     # lower casing the email. Passwords are unique. We can't lowercase those.
#     data.email = data.email.lower()

#     # first let's check if our user's email already exists in the database. The email would be a unique value anyway.
#     # if user's email already exists, check their password.
#     # if both email and password were verified to exist in the user database, 
#     # we generate an access token with expiry date kept in database.
#     # if user doesn't exist, send back a 401 status code with additional info such as 'Login invalid' or 'no such registered user' and suggest the user to register instead.
#     # -- done

#     # default response object
#     response = {
#         "UID": None,
#         "token": None,
#         "message": None,
#         "error": None
#     }

#     # login validated successfully!
#     if user_exists(data.email, data.password, auth_type):

#         # getting our user's saved user ID from the DB
#         for user_id, credential in fake_db.items():
#             if credential["email"] == data.email:
#                 # add UID in our response if email matches a record the db
#                 response.update({"UID": user_id})

#         # response = {
#         #     "message": "Authentication successful",
#         #     "token": None,
#         #     "UID": token_user_id
#         # }

#         # Check if token is valid
#         # If not, generate a new one and send it back to the client

#         if Authorization and Authorization.startswith("Bearer "):

#             token = Authorization.split(" ")[1]
            
#             try:
#                 payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
#                 # do any redirecting or leave it for the client with 'OK' message
#                 response.update({"message": "OK"})
            
#             except Exception as error:
#                 # alter message according to error
#                 if isinstance(error, jwt.ExpiredSignatureError):
#                     response.update({"message": "Token expired"})
#                 elif isinstance(error, jwt.DecodeError):
#                     response.update({"message": "Invalid token"})
#                 elif isinstance(error, jwt.InvalidSignatureError):
#                     response.update({"message": "Invalid signature"})

#                 response.update({"error": 403})
#         else:
#             # shouldn't usually occur since a registered user always receives a token at first.
#             response.update({"message": "No token was received in authorization header. Generated a new one"})
#             response.update({"error": 403})

#         # If not valid (expired or not received in the auth header), generate a new token.
#         # Add the expiry timestamp and user ID to the token's payload.
#         # Return auth success message AND a message indicating old token has expired. This is so that we can clear the old token from the client's local storage.
#         if response['error'] == 403:
#             generate_token = create_new_access_token(response['UID'], timedelta(minutes=ACCESS_TOKEN_EXPIRE_DAYS))
#             response.update({"token": generate_token})
#     else:
#         # raise a 401 error when a user tries to login but isn't a registered user.
#         response.update({"message": "Unauthorized"})
#         response.update({"error": 401})
    
#     # finally send back the response to the client
#     return response


# @auth_router.post("/register")
# async def register(data: User):

#     # setting auth_type
#     auth_type = "register"

#     # lower casing the email. Passwords are unique. We can't lowercase those.
#     data.email = data.email.lower()

#     # let's check if credentials already exist within our database.
#     # if so, respond back with a 409 conflict error indicating that the user's account already exist with the email provided.
#     # if they don't exist in the database, fetch the database to find the latest UID to generate an incremented UID.
#     # create a key with the UID and it's value would be an object containing the user's information such as emailm password, and a login token with it's expiry date.

#     # default response object
#     response = {
#         "UID": None,
#         "token": None,
#         "message": None,
#         "error": None
#     }

#     if not user_exists(data.email, data.password, auth_type):
#         # check UIDs from DB and generate a new one
#         new_user_id = generate_new_UID()
#         # add the new UID to our response
#         response.update({"UID": new_user_id})
#         # create a new user dict and fill in the details
#         new_user = {
#             new_user_id: {
#                 "email": data.email,
#                 "hashed_pass": data.password, # hash the password BEFORE forming our object and adding it to our DB.
#                 "disabled": False
#             }
#         }
#         # add our new user to our DB
#         fake_db.update(new_user)
#         # generate a new key send it back to the client in our response
#         generate_token = create_new_access_token(new_user_id, timedelta(minutes=ACCESS_TOKEN_EXPIRE_DAYS))
#         response.update({"token": generate_token})
#         response.update({"message": "OK"})
#     else:
#         # raise a 409 conflict error when a user tries to register with their email already registered.
#         response.update({"message": "User with this email has already been registered"})
#         response.update({"error": 409})

#     return response

# # protected endpoint
# @auth_router.post("/dashboard")
# async def dashboard():
#     pass