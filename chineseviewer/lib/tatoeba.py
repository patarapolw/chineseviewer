import sqlite3
import pinyin
import jieba
import regex
from typing import NamedTuple

from chineseviewer.dir import ROOT

class ChineseSentenceEntry(NamedTuple):
    chinese: str
    pinyin: str
    english: str

    @classmethod
    def from_row(cls, r):
        chinese = r[0]

        segments = []
        is_prev_zh = False
        for seg in jieba.cut(chinese):
            if regex.search(r"\p{IsHan}", seg) is None:
                is_prev_zh = False
            else:
                if is_prev_zh:
                    segments.append(" ")
                is_prev_zh = True
            segments.append(seg)

        return cls(
            chinese = chinese,
            pinyin = pinyin.get("".join(segments)),
            english = r[1]
        )

class Tatoeba:
    def __init__(self):
        self.conn = sqlite3.connect(str(ROOT.joinpath("data/tatoeba.db")), check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
    
    def get_chinese(self, s: str)->list:
        c = self.conn.execute("""
        SELECT
            s1."text" AS t1, s2."text" AS t2
        FROM
            sentences AS s1
            INNER JOIN "links"          ON s1.id = "links".sentence_id
            INNER JOIN sentences AS s2  ON "links".translation_id = s2.id
        WHERE
            s1."text" LIKE ? AND s1.lang = 'cmn' AND s2.lang = 'eng'
        """, (f"%{s}%",))

        return [ChineseSentenceEntry.from_row(r)._asdict() for r in c]
