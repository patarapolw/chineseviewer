import * as m from "mithril";
import * as XRegExp from "xregexp";
import * as $ from "jquery";

import InputBar from "../components/InputBar";
import getJsonFromUrl, { postJson } from "../utils";
import * as uuid4 from "uuid/v4";

export default (initialVnode: any) => {
    let subCompositions: any[] = [];
    let superCompositions: any[] = [];
    let variants: any[] = [];
    let vocab: any[] = [];
    let hanziList: string[] = [];
    let currentHanzi: string = "";

    const current: any = {};

    let i: number = 0;

    const IsHanRegex = XRegExp("\\p{Han}");

    function parseHanziList(s: string, index?: number) {
        if (s.length > 0) {
            const _hanziList: any = XRegExp.matchChain(s, [IsHanRegex]);
            hanziList = (_hanziList === null ? hanziList : _hanziList)
                .filter((el: string, _i: number, self: any) => {
                    return self.indexOf(el) === _i;
                });

            if (index !== undefined) {
                i = index;
            }
        }
    }

    function getCharacterBlock(s: string) {
        const sUuid = s + uuid4().substring(0, 8);

        return m(".character-block", [
            m(`#${sUuid}-base.character-block-base`, {
                onmouseenter(e: any) {
                    const baseEl = e.target;
                    const hoverEl = document.getElementById(`${sUuid}-hover`);
                    const $baseOffset = $(baseEl).offset();

                    if (hoverEl !== null && $baseOffset !== undefined) {
                        $(hoverEl).offset({
                            left: $baseOffset.left + (baseEl.offsetWidth / 2) - (hoverEl.offsetWidth / 2),
                            top: $baseOffset.top + (baseEl.offsetHeight / 2) - (hoverEl.offsetHeight / 2)
                        });

                        baseEl.style.color = "white";
                    }
                },
            }, s),
            m(`#${sUuid}-hover.character-block-hover.hanzi.zh-contextmenu`, {
                onclick(e: any) {
                    parseHanziList(e.target.innerText, 0);
                },
                onmouseout(e: any) {
                    const baseEl = document.getElementById(`${sUuid}-base`);
                    const $hoverEl = $(e.target);

                    let observer: any = null;
                    function removeHoverEl() {
                        if ($(".context-menu-list").length === 0) {
                            $hoverEl.offset({
                                left: -9999
                            });

                            if (baseEl !== null) {
                                baseEl.style.color = "black";
                            }

                            if (observer !== null) {
                                observer.disconnect();
                            }
                        }
                    }

                    observer = new MutationObserver(removeHoverEl);
                    observer.observe(document.body,  { attributes: true, childList: true });

                    removeHoverEl();
                },
            }, s)
        ]);
    }

    return {
        view() {
            const urlJson = getJsonFromUrl();
            const q = urlJson.q;

            if (current.q !== q) {
                parseHanziList(q);
                current.q = q;
            }

            if (currentHanzi !== hanziList[i] && hanziList[i] !== undefined) {
                currentHanzi = hanziList[i];
                postJson("/api/hanzi/radical", {
                    entry: hanziList[i]
                }).then((res) => {
                    subCompositions = res.subcompositions.map((el: string) => getCharacterBlock(el));
                    superCompositions = res.supercompositions.map((el: string) => getCharacterBlock(el));
                    variants = res.variants.map((el: string) => getCharacterBlock(el));
                    m.redraw();
                });

                postJson("/api/all/dictionary", {
                    entry: hanziList[i]
                }).then((res) => {
                    vocab = res.map((el: any) => {
                        return m(".inline", [
                            m(".zh-contextmenu.vocab", el.simplified),
                            el.traditional === undefined ? "" : m(".zh-contextmenu.vocab", el.traditional),
                            m("div", `[${el.pinyin}]`),
                            m("div", el.english)
                        ]);
                    });
                    m.redraw();
                });
            }

            return m(".row.mt-3", [
                m(".input-group", [
                    m(InputBar, {
                        parse(v: string) { parseHanziList(v, 0); }
                    })
                ]),
                m(".row.mt-3.full-width", [
                    m(".col-6.text-center", [
                        m("input.hanzi.zh-contextmenu", {
                            oninput(e: any) {
                                parseHanziList(e.target.value);
                                return true;
                            },
                            value: hanziList[i]
                        }),
                        m(".button-prev-next", [
                            m(".btn-group.col-auto", [
                                m("button.btn.btn-info.btn-default", {
                                    disabled: !(i > 0),
                                    onclick(e: any) { i--; m.redraw(); }
                                }, "Previous"),
                                m("button.btn.btn-info.btn-default", {
                                    disabled: !(i < hanziList.length - 1),
                                    onclick(e: any) { i++; m.redraw(); }
                                }, "Next")
                            ])
                        ])
                    ]),
                    m(".col-6", [
                        m(".row", m("h4", "Subcompositions")),
                        m(".row.hanzi-list", subCompositions),
                        m(".row", m("h4", "Supercompositions")),
                        m(".row.hanzi-list", superCompositions),
                        m(".row", m("h4", "Variants")),
                        m(".row.hanzi-list", variants),
                        m(".row", m("h4", "Vocabularies")),
                        m(".row", vocab),
                    ])
                ])
            ]);
        }
    };
};
