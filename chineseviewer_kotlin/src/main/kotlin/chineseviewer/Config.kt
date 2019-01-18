package chineseviewer

import io.github.cdimascio.dotenv.dotenv

object Config {
    val env = dotenv {
        ignoreIfMissing = true
        directory = "/Users/patarapolw/GitHubProjects/chineseviewer4k"
    }
}