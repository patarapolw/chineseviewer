import pytest

from chineseviewer.lib.cedict import Cedict

cedict = Cedict()

@pytest.mark.parametrize("s_in", [
    "你好"
])
def test_search_chinese(s_in: str):
    print(cedict.search_chinese(s_in))

@pytest.mark.parametrize("s_in", [
    "zhong1 wen2"
])
def test_search_pinyin(s_in: str):
    print(cedict.search_pinyin(s_in))

@pytest.mark.parametrize("s_in", [
    "english"
])
def test_search_english(s_in: str):
    print(cedict.search_english(s_in)[:5])

@pytest.mark.parametrize("s_in", [
    "你好",
    "zhong1 wen2",
    "English"
])
def test_search(s_in: str):
    print(cedict.get(s_in)[:5])
