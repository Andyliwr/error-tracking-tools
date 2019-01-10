from index import db
import datetime


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
