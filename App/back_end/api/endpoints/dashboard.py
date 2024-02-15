from colorama import Fore
from fastapi import APIRouter, Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
import jwt
from api.endpoints.auth import is_token_valid
from pydantic import BaseModel

dashboard_router = APIRouter()

current_user_id = None

default_reponse = {
    'valid': None,
    'message': None,
    'error': None
}

blacklisted_tokens = [

]

@dashboard_router.post('/dashboard')
def dashboard(token: dict = Depends(is_token_valid)):
    if token['valid']:
        # extract payload - user id
        user_id = token['UID']
        current_user_id = user_id
    else:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token['error']}')


@dashboard_router.post('/dashboard/logout')
def logout(token: dict = Depends(is_token_valid)):
    
    if token['valid']:
        # perform any cleanups, etc.
        return {'logout': True}
    else:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token['error']}')