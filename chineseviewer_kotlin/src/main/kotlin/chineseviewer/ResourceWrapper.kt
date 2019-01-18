package chineseviewer

import cedict.Cedict
import cjkrad4j.RadicalFinder
import com.huaban.analysis.jieba.JiebaSegmenter
import net.duguying.pinyin.Pinyin
import translatesentence.CESentenceDictionary

class ResourceWrapper {
    val finder = RadicalFinder("jdbc:sqlite::resource:cjkrad4j.db")
    val dict = Cedict("jdbc:sqlite::resource:cedict.db")
    val sentenceDictionary = CESentenceDictionary("jdbc:sqlite::resource:tatoeba.db")
    val segmenter = JiebaSegmenter()
    val pinyin = Pinyin()

    inner class Hanzi {
        fun getRadical(s: String) = finder[s]
    }

    inner class Vocab {
        fun dictionaryMatch(s: String) = dict.searchChineseMatch(s)
        fun dictionaryMatchMany(sList: List<String>) = sList.flatMap { dict.searchChineseMatch(it) }.distinct()
    }

    inner class Sentence {
        fun jieba(s: String) = segmenter.sentenceProcess(s).map { mapOf(
                "word" to it,
                "pinyin" to if (Regex("\\p{IsHan}").containsMatchIn(it)) pinyin.translate(it) else ""
        ) }
        fun example(s: String, limit: Int = 10) = sentenceDictionary[s].filterIndexed { i, _ -> i < limit }
    }

    inner class AllTypes {
        fun dictionary(s: String, limit: Int = 10) = dict[s].filterIndexed { i, _ -> i < limit }
    }

    val hanzi = Hanzi()
    val vocab = Vocab()
    val sentence = Sentence()
    val allTypes = AllTypes()
}