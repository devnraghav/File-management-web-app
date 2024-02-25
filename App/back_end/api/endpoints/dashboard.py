from colorama import Fore, Style
from fastapi import APIRouter, Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
import jwt
from api.endpoints.auth import is_token_valid
from pydantic import BaseModel
from database.setup import Session, Users


class account_info_model(BaseModel):
    display_name: str
    email: str
    password: str
    # TODO: add change password functionality
    # newpassword: str


dashboard_router = APIRouter()

current_user_id = None

default_reponse = {
    'valid': None,
    'message': None,
    'error': None
}


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
    token_user_id = token['UID']

    session = Session()

    try:
        user = session.query(Users).filter_by(user_id=token_user_id).first()
        session.commit()
        return {'display_name': user.user_display_name, 'email': user.user_email, 'password': user.user_password}
    except Exception as e:
        session.rollback()
        print(f'{Fore.RED+Style.BRIGHT} Error getting user info: {e} {Style.RESET_ALL}')
    finally:
        session.close()



# if user made any changes to their account info, update the database
# unt_info')
@dashboard_router.post('/dashboard/account_info')
def update_account_info(data: account_info_model, token: dict = Depends(is_token_valid)):
    if not token['valid']:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token["error"]}')
    # encrption needs to be done here
    token_user_id = token['UID']

    # update the user in database
    session = Session()

    try:
        user = session.query(Users).filter_by(user_id=token_user_id).first()
        user.user_id = token_user_id
        user.user_email = data.email
        user.user_password = data.password
        user.user_display_name = data.display_name
        session.commit()
    except Exception as e:
        session.rollback()
        print(f'{Fore.RED+Style.BRIGHT} Error getting user info: {e} {Style.RESET_ALL}')
    finally:
        session.close()