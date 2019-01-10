import datetime

from flaskr.db import get_db

db = get_db()


class User(db.Model):
    # define table name
    __tablename__ = 'users'
    # define table column
    id = db.Column(db.Interge, primary_key=True)
    # unique and create indexs for searching
    username = db.Column(db.String(50), unique=True, index=True)
    avatar = db.Column(db.String(100))
    password = db.Column(db.String(100))
    email = db.Column(db.String(75), unique=True)
    email_verified = db.Column(db.String, default=False)
    phone = db.Column(db.String(11), unique=True)
    phone_verified = db.Column(db.String, default=False)
    create_time = db.Column(db.Date(), default=datetime.datetime.now())


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Interge, primary_key=True)
    owner = db.Column(db.Interge, db.ForeignKey('users.id'))
    name = db.Column(db.String(50))
    des = db.Column(db.String(100))
    platform = db.Column(db.Enum('nodejs', 'javascript'))
    create_time = db.Column(db.Date(), default=datetime.datetime.now())


class Error(db.Model):
    id = db.Column(db.Interge, primary_key=True)
    owner = db.Column(db.Interge, db.ForeignKey('projects.id'))
    level = db.Column(db.Enum('error', 'danger', 'warning', 'info', 'debug'))
    name = db.Column(db.String(50))
    des = db.Column(db.String(100))
    other = db.Column(db.Text(100))
    create_time = db.Column(db.Date(), default=datetime.datetime.now())
