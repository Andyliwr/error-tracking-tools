# -*- coding: utf-8 -*-
# Application configuration
import os
from os import getenv


class Config():
    # get attribute
    WOCAO = True

class DevelopmentConfig(Config):
    DB_HOST = 'sql12.freemysqlhosting.net'
    DB_PORT = '3306'
    DB_USERNAME = 'sql12273368'
    DB_PASSWORD = 'qjeYT8Z4R1'
    DB_NAME = 'sql12273368'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    KKK = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True

mapping = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}

FLASK_ENV = os.environ.get('FLASK_ENV', 'default').lower()
config = mapping[FLASK_ENV]
