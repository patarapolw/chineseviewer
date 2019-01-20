import sqlite3
import regex
from typing import NamedTuple

from chineseviewer.dir import ROOT


class CedictEntry(NamedTuple):
    simplified: str
    pinyin: str
    english: str
    traditional: str = None

    @classmethod
    def from_row(cls, r):
        return cls(
            simplified=r["simplified"],
            traditional=r["traditional"],
            pinyin=r["pinyin"],
            english=r["english"]
        )


class Cedict:
    def __init__(self):
        self.conn = sqlite3.connect(str(ROOT.joinpath("data/cedict.db")), check_same_thread=False)
        self.conn.row_factory = sqlite3.Row

    def _search_one(self, s: str, col: str) -> dict:
        result = dict()

        c = self.conn.execute(f"""
        SELECT * FROM cedict WHERE {col} LIKE ?
        """, (f"%{s}%",))

        for r in c:
            result[r["id"]] = {
                "entry": CedictEntry.from_row(r)._asdict(),
                "frequency": r["frequency"]
            }

        return result

    def search_chinese(self, s: str) -> list:
        c = self.conn.execute("""
        SELECT * FROM cedict
        WHERE simplified LIKE ? OR traditional LIKE ?
        ORDER BY frequency DESC
        """, (f"%{s}%", f"%{s}%"))

        return [CedictEntry.from_row(r)._asdict() for r in c]

    def search_chinese_match(self, s: str) -> list:
        c = self.conn.execute("""
        SELECT * FROM cedict
        WHERE simplified = ? OR traditional = ?
        ORDER BY frequency DESC
        """, (s, s))

        return [CedictEntry.from_row(r)._asdict() for r in c]

    def search_english(self, s: str) -> list:
        return [x["entry"] for x in sorted(self._search_one(s, "english").values(), key=lambda x: -x["frequency"])]

    def search_pinyin(self, s: str) -> list:
        return [x["entry"] for x in sorted(self._search_one(s, "pinyin").values(), key=lambda x: -x["frequency"])]

    def _search_pinyin_english(self, s: str) -> list:
        d = self._search_one(s, "english")
        d.update(self._search_one(s, "pinyin"))

        return [x["entry"] for x in sorted(d.values(), key=lambda x: -x["frequency"])]

    def get(self, s: str) -> list:
        if regex.search(r"\p{IsHan}", s) is None:
            return self._search_pinyin_english(s)
        else:
            return self.search_chinese(s)
