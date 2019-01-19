import * as m from "mithril";
import * as XRegExp from "xregexp";

import { postJson } from "../utils";

const hanRegex = XRegExp("\\p{Han}")

export default (initialVnode: any) => {
    let textSegments: any[] = [m("div",
        "The result of the parsing of the text will be shown here.")];

    function parseSentence(s: string) {
        postJson("/api/sentence/jieba", { entry: s }).then((res) => {
            textSegments = res.segments.map((el: any) => {
                return !hanRegex.test(el.word) ? el.word : m("ruby", [
                    m("rt", el.pinyin),
                    m(".zh-contextmenu.vocab", el.word),
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
                m("pre.col-12.ruby-area", textSegments),
            ]);
        }
    };
};
