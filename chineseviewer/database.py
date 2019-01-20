from . import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)

    subs = db.relationship("UserSub", backref="user", lazy=True)
    hanzis = db.relationship("Hanzi", backref="user", lazy=True)
    vocabs = db.relationship("Vocab", backref="user", lazy=True)


class UserSub(db.Model):
    __table_args__ = (
        db.UniqueConstraint("user_id", "sub"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    sub = db.Column(db.String, nullable=False)


class Hanzi(db.Model):
    __table_args__ = (
        db.UniqueConstraint("user_id", "entry"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    entry = db.Column(db.String, nullable=False)


class Vocab(db.Model):
    __table_args__ = (
        db.UniqueConstraint("user_id", "entry"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    entry = db.Column(db.String, nullable=False)
