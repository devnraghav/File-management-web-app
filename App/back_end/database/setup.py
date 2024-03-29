from colorama import Fore, Back, Style
from sqlalchemy import create_engine, ForeignKey, Column, Integer, String, CHAR, MetaData
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# mysql credentials
username = 'root'
password = 'password'
host = 'localhost:3306'
database ='file_management_app'

engine = create_engine(f'mysql+mysqlconnector://{username}:{password}@{host}/{database}')

try:
    engine.connect()
except Exception as e:
    print(f'{Fore.RED+Style.BRIGHT} Error connecting to DB: {e} {Style.RESET_ALL}')


base = declarative_base()
class Users(base):
    __tablename__ = 'users'
    user_id = Column('user_id', String(50), primary_key=True)
    user_email = Column('email', String(50), nullable=False)
    user_password = Column('password', String(50), nullable=False)
    user_display_name = Column('display_name', String(50), nullable=False)


# create all tables in the database
base.metadata.create_all(bind=engine)

Session = sessionmaker(bind=engine)