from flask import request, jsonify, Response
import jieba
import pinyin
import regex
from sqlalchemy.exc import IntegrityError

from . import app, db
from .lib.cedict import Cedict
from .lib.cjkrad import CjkRad
from .lib.tatoeba import Tatoeba
from .database import User, UserSub, Hanzi, Vocab

cedict = Cedict()
cjkrad = CjkRad()
tatoeba = Tatoeba()


@app.route("/api/hanzi/radical", methods=["POST"])
def api_hanzi_radical():
    r = request.get_json()
    return jsonify(cjkrad.get(r["entry"]))


@app.route("/api/vocab/dictionary/match", methods=["POST"])
def api_vocab_dictionary_match():
    r = request.get_json()
    return jsonify(cedict.search_chinese_match(r["entry"]))


@app.route("/api/vocab/dictionary/matchMany", methods=["POST"])
def api_vocab_dictionary_match_many():
    r = request.get_json()
    return jsonify([item for ls in 
        [cedict.search_chinese_match(e) for i, e in enumerate(r["entries"]) if e not in r["entries"][:i]]
        for item in ls])


@app.route("/api/sentence/jieba", methods=["POST"])
def api_sentence_jieba():
    r = request.get_json()
    return jsonify([{
        "word": seg,
        "pinyin": pinyin.get(seg) if regex.search(r"\p{IsHan}", seg) else ""
    } for seg in jieba.cut(r["entry"])])


@app.route("/api/sentence/example", methods=["POST"])
def api_sentence_example():
    r = request.get_json()
    return jsonify(tatoeba.get_chinese(r["entry"])[:10])


@app.route("/api/all/dictionary", methods=["POST"])
def api_all_dictionary():
    r = request.get_json()
    return jsonify(cedict.get(r["entry"])[:10])


@app.route("/api/database/user/check", methods=["POST"])
def api_database_user_check():
    r = request.get_json()

    user_sub = UserSub.query.filter_by(sub=r["sub"]).first()
    return jsonify(user_sub is not None)


@app.route("/api/database/user/add", methods=["POST"])
def api_database_user_add():
    r = request.get_json()

    user = None
    if r["userId"]:
        user = User.query.filter_by(id=r["userId"]).first()

    if user is None:
        user = User(email=r["email"])
        db.session.add(user)
        db.session.commit()

    user_sub = UserSub(sub=r["sub"], user_id=user.id)
    try:
        db.session.add(user_sub)
        db.session.commit()
    except IntegrityError:
        if not r["id"]:
            db.session.delete(user)
            db.session.commit()

        return Response(status=304)

    return jsonify({
        "sub_id": user_sub.id,
        "user_id": user.id
    }), 201


@app.route("/api/database/user/removeSub", methods=["POST"])
def api_database_user_remove_sub():
    r = request.get_json()
    user_sub = UserSub.query.filter_by(sub=r["sub"]).first()

    is_user_to_remove = False
    if len(user_sub.user.subs) <= 1:
        is_user_to_remove = True

    db.session.delete(user_sub)

    if is_user_to_remove:
        db.session.delete(user_sub.user)

    db.session.commit()

    return Response(status=201)


@app.route("/api/database/user/remove", methods=["POST"])
def api_database_user_remove():
    r = request.get_json()
    user = User.query.filter_by(sub=r["userId"]).first()

    for user_sub in user.subs:
        db.session.delete(user_sub)
    db.session.delete(user)
    db.session.commit()

    return Response(status=201)


@app.route("/api/database/check", methods=["POST"])
def api_database_check():
    r = request.get_json()

    if r["type"] == "hanzi":
        query = Hanzi.query.filter_by(entry=r["entry"], user_id=r["userId"]).first()
    elif r["type"] == "vocab":
        query = Vocab.query.filter_by(entry=r["entry"], user_id=r["userId"]).first()
    else:
        return Response(status=404)

    return jsonify(query is not None)


@app.route("/api/database/add", methods=["POST"])
def api_database_add():
    r = request.get_json()

    if r["type"] == "hanzi":
        query = Hanzi(entry=r["entry"], user_id=r["userId"])
    elif r["type"] == "vocab":
        query = Vocab(entry=r["entry"], user_id=r["userId"])
    else:
        return Response(status=404)

    db.session.add(query)
    db.session.commit()

    return jsonify({
        "id": query.id
    })


@app.route("/api/database/remove")
def api_database_remove():
    r = request.get_json()

    if r["type"] == "hanzi":
        query = Hanzi.query.filter_by(entry=r["entry"], user_id=r["userId"]).first()
    elif r["type"] == "vocab":
        query = Vocab.query.filter_by(entry=r["entry"], user_id=r["userId"]).first()
    else:
        return Response(status=404)

    db.session.delete(query)
    db.session.commit()

    return Response(status=201)
