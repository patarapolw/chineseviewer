package chineseviewer

import com.google.gson.Gson
import spark.Filter
import spark.Request
import spark.Response
import spark.Spark
import spark.kotlin.port
import spark.kotlin.post
import spark.kotlin.staticFiles
import java.awt.Desktop
import java.net.URI

class Server {
    private val frontendPort = Config.env["TS_PORT"] ?: "3000"
    private val corsHeaders = mapOf(
            "Access-Control-Allow-Origin" to "http://localhost:$frontendPort"
    )
    private val gson = Gson()

    private val resourceWrapper = ResourceWrapper()

    private data class EntryRequest (val entry: String, val type: String? = null)
    private data class EntriesRequest (val entries: List<String>)

    private fun applyRest() {
        Spark.after(Filter { _: Request, response: Response ->
            corsHeaders.forEach { k, v -> response.header(k, v) }
            response.type("application/json")
        })
    }

    fun runserver() {
        staticFiles.location("/public")

        Config.env["KOTLIN_PORT"]?.let {
            port(it.toInt())
        } ?: port(System.getenv("PORT").toInt())

        applyRest()

        post("/api/hanzi/radical") {
            val entryRequest = gson.fromJson(this.request.body(), EntryRequest::class.java)
            gson.toJson(resourceWrapper.hanzi.getRadical(entryRequest.entry))
        }

        post("/api/vocab/dictionary/match") {
            val entryRequest = gson.fromJson(this.request.body(), EntryRequest::class.java)
            gson.toJson(mapOf(
                    "entries" to resourceWrapper.vocab.dictionaryMatch(entryRequest.entry)
            ))
        }

        post("/api/vocab/dictionary/matchMany") {
            val entriesRequest = gson.fromJson(this.request.body(), EntriesRequest::class.java)
            gson.toJson(mapOf(
                    "entries" to resourceWrapper.vocab.dictionaryMatchMany(entriesRequest.entries)
            ))
        }

        post("/api/sentence/jieba") {
            val entryRequest = gson.fromJson(this.request.body(), EntryRequest::class.java)
            gson.toJson(mapOf(
                    "segments" to resourceWrapper.sentence.jieba(entryRequest.entry)
            ))
        }

        post("/api/sentence/example") {
            val entryRequest = gson.fromJson(this.request.body(), EntryRequest::class.java)
            gson.toJson(mapOf(
                    "entries" to resourceWrapper.sentence.example(entryRequest.entry)
            ))
        }

        post("/api/all/dictionary") {
            val entryRequest = gson.fromJson(this.request.body(), EntryRequest::class.java)
            gson.toJson(mapOf(
                    "entries" to resourceWrapper.allTypes.dictionary(entryRequest.entry)
            ))
        }

        post("/api/link/open") {
            val entryRequest = gson.fromJson(this.request.body(), EntryRequest::class.java)
            Desktop.getDesktop().browse(URI(entryRequest.entry))

            gson.toJson(mapOf(
                    "success" to true
            ))
        }
    }
}