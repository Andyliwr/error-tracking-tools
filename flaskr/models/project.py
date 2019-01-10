from index import db
import datetime


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Interge, primary_key=True)
    owner = db.Column(db.Interge, db.ForeignKey('users.id'))
    name = db.Column(db.String(50))
    des = db.Column(db.String(100))
    platform = db.Column(db.Enum('nodejs', 'javascript'))
    create_time = db.Column(db.Date(), default=datetime.datetime.now())
