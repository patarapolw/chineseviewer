import * as m from "mithril";

import { postJson } from "../utils";

export default (initialVnode: any) => {
    let textSegments: any[] = [m(".ruby",
        "The result of the parsing of the text will be shown here.")];

    function parseSentence(s: string) {
        postJson("/api/sentence/jieba", { entry: s }).then((res) => {
            textSegments = res.segments.map((el: any) => {
                return el.word === "\n" ? m("br.ruby") : m("ruby.ruby.zh-contextmenu.vocab", [
                    m("rt", el.pinyin),
                    el.word,
                ]);
            });
            m.redraw();
        });
    }

    return {
        view() {
            return m(".mt-3", [
                m(".col", {
                    style: {
                        display: "inline-block"
                    }
                }, [
                    m("textarea.clipboard-input.col-md-6", {
                        oninput(e: any) {
                            parseSentence(e.target.value);
                        }
                    }),
                ]),
                m(".col-12", textSegments),
            ]);
        }
    };
};
