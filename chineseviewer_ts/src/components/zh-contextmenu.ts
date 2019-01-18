import {ContextMenu, ContextMenuItemTypes} from "jquery-contextmenu";
import * as $ from "jquery";
import { postJson } from "../utils";
import * as XRegExp from "xregexp";

import "jquery-contextmenu/dist/jquery.contextMenu.min.css"

export default $(() => {
    const contextMenu = new ContextMenu();

    contextMenu.create({
        selector: ".zh-contextmenu",
        build($trigger: any) {
            const text = $trigger.currentTarget.innerText || $trigger.currentTarget.value;
            if (!XRegExp("\\p{Han}").test(text)) {
                return false;
            }

            const menu = {
                items: {
                    speak: {
                        name: "Speak",
                        callback() {
                            (window as any).responsiveVoice.speak(text, "Chinese Male");
                        }
                    },
                    parseHanzi: {
                        name: "Parse Hanzi",
                        callback() {
                            open(location.origin + `/#!/Hanzi?q=${encodeURIComponent(text)}`, "_blank");
                        }
                    },
                    parseVocab: {
                        name: "Parse vocab",
                        callback() {
                            open(location.origin + `/#!/Vocab?q=${encodeURIComponent(text)}`, "_blank");
                        }
                    }
                }
            };

            const classList = $trigger.currentTarget.className.split(" ");

            if (classList.indexOf("hanzi") !== -1) {
                delete menu.items.parseHanzi;
            }

            if (classList.indexOf("vocab") !== -1) {
                Object.assign(menu.items, {
                    readAsVocab: {
                        name: "Read as vocab",
                        callback() {
                            open(location.origin + `/#!/Vocab?si=${encodeURIComponent(text)}`, "_blank");
                        }
                    }
                });
            }

            return menu;
        }
    });
});
