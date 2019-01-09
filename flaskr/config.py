# -*- coding: utf-8 -*-
# Application configuration


class BaseConfig():
    SECRET_KEY = 'dev'


class DevelopmentConfig(BaseConfig):
    MONGO_HOST = '127.0.0.1'
    MONGO_PORT = '27017'
    MONGO_USER = ''
    MONGO_PASS = ''


class ProductionConfig(BaseConfig):
    MONGO_HOST = '127.0.0.1'
    MONGO_PORT = '27017'
    MONGO_USER = ''
    MONGO_PASS = ''
