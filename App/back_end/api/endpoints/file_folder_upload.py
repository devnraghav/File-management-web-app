from colorama import Fore, Back, Style
from sqlalchemy import create_engine, ForeignKey, Column, Integer, String, CHAR, MetaData
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from api.endpoints.auth import is_token_valid
import os
# from pydantic import BaseModel

upload_router = APIRouter()

@upload_router.post('/dashboard/upload')
async def upload_file(token: dict = Depends(is_token_valid), file : UploadFile = UploadFile(...)):

    # this function has to be async due to file processing

    if not token['valid']:
        raise HTTPException(status_code=401, detail=f'Unauthorized: {token["error"]}')
    

    # print(os.listdir(file_path))
    # os.makedirs(file_path, exist_ok=True)

    # # extract payload - user id
    # user_id = token['UID']
    # current_user_id = user_id

    # file_content = await file.read()
    # print(f'{Fore.WHITE} Uploading file: {file_content} {Style.RESET_ALL}')

    return {'message': 'File uploaded successfully'}
