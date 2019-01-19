import pytest

from chineseviewer.lib.cjkrad import CjkRad

rad = CjkRad()

@pytest.mark.parametrize("s_in", [
    "你",
    "好",
    "你好"
])
def test_cjkrad(s_in: str):
    print(rad.get(s_in))
