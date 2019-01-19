import sqlite3
from typing import NamedTuple

from chineseviewer.dir import ROOT

class CjkRadEntry(NamedTuple):
    subcompositions: list
    supercompositions: list
    variants: list

class CjkRad:
    def __init__(self):
        self.conn = sqlite3.connect(str(ROOT.joinpath("data/cjkrad.db")), check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
    
    def _get_components(self, s: str, table_name: str)->list:
        c = self.conn.execute(f"""
        SELECT s.character
        FROM character AS c
        INNER JOIN {table_name} AS cs ON cs.character_id = c.id
        INNER JOIN character AS s ON cs.{table_name}_id = s.id
        WHERE c.character = ?
        ORDER BY s.frequency ASC
        """, (s,))

        return [r[0] for r in c]
    
    def get(self, s: str)->dict:
        return CjkRadEntry(
            subcompositions=self._get_components(s, "sub"),
            supercompositions=self._get_components(s, "super"),
            variants=self._get_components(s, "variant")
        )._asdict()
