import * as m from "mithril";

export default {
    view(vnode: any) {
        return m("input.form-control", {
            type: "text",
            placeholder: "Input a Hanzi, word or sentence",
            onkeypress(e: any) {
                if (e.keyCode === 13 || e.which === 13 || e.key === "Enter") {
                    vnode.attrs.parse(e.target.value);
                }
            },
        });
    }
};
