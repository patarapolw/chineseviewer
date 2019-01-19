import * as m from "mithril";

export default {
    view() {
        return m("form.form-inline.searchBar", [
            m("input.form-inline.form-control", {
                type: "search",
                placeholder: "Search your favorite words here",
                style: {
                    width: "100%",
                }
            })
        ]);
    }
};
