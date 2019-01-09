# -*- coding: utf-8 -*-
# Application configuration
import os
from os import getenv


class Config():
    # get attribute
    WOCAO = True

class DevelopmentConfig(Config):
    DEBUG = True
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
