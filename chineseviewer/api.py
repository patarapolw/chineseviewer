from flask import request, jsonify
import jieba
import pinyin
import regex

from . import app
from .lib.cedict import Cedict
from .lib.cjkrad import CjkRad
from .lib.tatoeba import Tatoeba

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
