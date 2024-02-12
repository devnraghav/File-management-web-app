from colorama import Fore
from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.security import OAuth2PasswordBearer
import jwt
from api.endpoints.auth import is_token_valid, SECRET_KEY, ALGORITHM
from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

dashboard_router = APIRouter()

current_user_id = None

@dashboard_router.post('/dashboard')
def dashboard(token: str = Depends(oauth2_scheme)):

    response = {
        'valid': None,
        'message': None,
        'error': None
    }

    if not token:
        response.update({'error': 401, 'message': 'Unauthorized'})
    else:
        payload = is_token_valid(token)
        if payload:
            response.update({'valid': True})
            current_user_id = payload['UID']
        else:
            response.update({'valid': False, 'message': 'Invalid token'})

    return response


print(Fore.RED + str(current_user_id))