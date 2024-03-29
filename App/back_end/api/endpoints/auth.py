# xxxxxxx xxxxxxx AUTH FLOW xxxxxxx xxxxxxx

from colorama import Fore, Style
from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import uuid
from database.setup import Session, Users

def print_error(e):
    print(f'{Fore.RED+Style.BRIGHT} {str(e)} {Style.RESET_ALL}')

def generate_new_token(user_id, key, algorithm):

    token_expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRY_MINS)

    # ecrypt the email before payload
    payload = {
        'sub': user_id,
        'exp': token_expire
    }

    return jwt.encode(payload, key, algorithm)

# this function has to also check for any blacklisted tokens
def is_token_valid(Authorization: str = Header(None)):
    valid = False
    token_error = ''
    if Authorization and Authorization.startswith('Bearer'):
        try:
            token = Authorization.split('Bearer ')[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)

            return {'valid': True, 'UID': payload['sub']}
        except Exception as error:  
            if isinstance(error, jwt.DecodeError):
                token_error = 'Invalid token'
            elif isinstance(error, jwt.ExpiredSignatureError):
                token_error = 'Expired token'
            elif isinstance(error, jwt.InvalidTokenError):
                token_error = 'Invalid token format'
            else:
                token_error = f'Unexpected token error: {error}'   
    return {'valid': valid, 'error': token_error}


def does_user_exist(email, password):
    session = Session()
    try:
        if password:
            user = session.query(Users).filter_by(user_email=email, user_password=password).first()
            session.commit()
            return user.user_id
        else:
            user = session.query(Users).filter_by(user_email=email).first()
            session.commit()
            return True
    except Exception as e:
        session.rollback()
        print_error(f'Something went wrong checking if user exists: {e}')
    finally:
        session.close()
        
    # return false (not found) by default
    return False


def add_new_user(display_name, email, password):
    session = Session()
    new_user_id = str(uuid.uuid4())

    try:
        # generating a new user id
        session.add(Users(user_id=new_user_id, user_email=email, user_password=password, user_display_name=display_name))
        session.commit()
    except Exception as e:
        session.rollback()
        print_error(f'Something went wrong adding a user: {e}')
    finally:
        session.close()

    return new_user_id

class User_model(BaseModel):
    display_name: str
    email: str
    password: str

# init router
auth_router = APIRouter()

# JWT

SECRET_KEY = 'be348ed3ab2f6179a07af7759a980eaf9d4d1892d5c611796b75bb27f1c300fa20ef0b7e56cd7ab9cec5670360e1a781a6c89e06469caa4ef7c8f235e72bdca4'
ALGORITHM = 'HS256'
TOKEN_EXPIRY_MINS = 120

@auth_router.post('/login')
def login(data: User_model):
    response = {}

    user_exists = does_user_exist(data.email, data.password)
    
    if user_exists:

        new_token = generate_new_token(user_exists, SECRET_KEY, ALGORITHM)


        # add this token to the database with the user

        response.update({'token': new_token})

        # raise HTTPException(status_code=401, detail='Unauthorized. Credentials incorrect or user does not exist.')
    else:
        response.update({'error': 401})

    return response


@auth_router.post('/registration')
def register(data: User_model):

    response = {}

    user_exists = does_user_exist(data.email, None)

    if user_exists:
        response.update({'error': 409})
        # raise HTTPException(status_code=409, detail='Conflict error. User with this email already exists.')
    else:

        new_uid = add_new_user(data.display_name, data.email, data.password)

        new_token = generate_new_token(new_uid, SECRET_KEY, ALGORITHM)

        response.update(
            {
                'token': new_token,
                'message': 'OK'
            }
        )

    return response