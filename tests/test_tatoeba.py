import pytest

from chineseviewer.lib.tatoeba import Tatoeba

tatoeba = Tatoeba()

@pytest.mark.parametrize("s_in", [
    "你好",
    "中文"
])
def test_tatoeba_chinese(s_in: str):
    print(tatoeba.get_chinese(s_in))
