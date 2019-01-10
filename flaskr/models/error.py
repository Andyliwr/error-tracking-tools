from index import db
import datetime


class Error(db.Model):
    id = db.Column(db.Interge, primary_key=True)
    owner = db.Column(db.Interge, db.ForeignKey('projects.id'))
    level = db.Column(db.Enum('error', 'danger', 'warning', 'info', 'debug'))
    name = db.Column(db.String(50))
    des = db.Column(db.String(100))
    other = db.Column(db.Text(100))
    create_time = db.Column(db.Date(), default=datetime.datetime.now())
