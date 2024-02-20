from colorama import Fore
from fastapi import APIRouter, Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
import jwt
from api.endpoints.auth import is_token_valid
from pydantic import BaseModel
from database.setup import fake_db


class account_info_model(BaseModel):
    display_name: str
    email: str
    secured_pass: str
    # TODO: add change password functionality
    # newpassword: str




dashboard_router = APIRouter()

current_user_id = None

default_reponse = {
    'valid': None,
    'message': None,
    'error': None
}

blacklisted_tokens = [

]

@dashboard_router.get('/dashboard')
def dashboard(token: dict = Depends(is_token_valid)):
    if not token['valid']:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token['error']}')
    
    # extract payload - user id
    user_id = token['UID']
    current_user_id = user_id


@dashboard_router.post('/dashboard/logout')
def logout(token: dict = Depends(is_token_valid)):
    if not token['valid']:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token['error']}')
        # perform any cleanups needed.

    return {'logout': True}


@dashboard_router.get('/dashboard/account_info')
def get_account_info(token: dict = Depends(is_token_valid)):
    if not token['valid']:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token["error"]}')
    # encrption needs to be done here
    user_id = token['UID']

    for user in fake_db:
        if user['UID'] == user_id:
            return user
        

# if user made any changes to their account info, update the database
# unt_info')
@dashboard_router.post('/dashboard/account_info')
def update_account_info(data: account_info_model, token: dict = Depends(is_token_valid)):
    if not token['valid']:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token["error"]}')
    # encrption needs to be done here
    user_id = token['UID']

    # update the user in database
    for user in fake_db:
        if user['UID'] == user_id:
            user['display_name'] = data.display_name
            user['email'] = data.email
            user['secured_pass'] = data.secured_pass