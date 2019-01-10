# -*- coding: utf-8 -*-
import click
from flask import current_app, g
from flask.cli import with_appcontext
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from flaskr.config import config

engine = create_engine(config['SQLALCHEMY_DATABASE_URI'], convert_unicode=True)
db_session = scoped_session(sessionmaker(
    autocommit=False, utoflush=False, ind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    import flaskr.models.user
    import flaskr.models.project
    import flaskr.models.error
    Base.metadata.create_all(bind=engine)


def init_app(app):
    print('hello')
    app.teardown_appcontext(close_db)  # 告诉 Flask 在返回响应后进行清理的时候调用此函数
    app.cli.add_command(init_db_command)  # 添加一个新的 可以与 flask 一起工作的命令


def get_db():
    if 'db' not in g:
        g.db = SQLAlchemy(current_app)
    return g.db


def close_db(e=None):
    print('close db')


@click.command('init-db')
@with_appcontext
def init_db_command():
    # clear the existing data and create new tables.
    init_db()
    click.echo('Initialized the database.')
