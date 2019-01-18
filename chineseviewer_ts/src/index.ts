import * as m from "mithril";
import * as $ from "jquery";

import NavbarLeft from "./components/NavbarLeft";
import NavbarRight from "./components/NavbarRight";
import Hanzi from "./views/Hanzi";
import Home from "./views/Home";
import Vocab from "./views/Vocab";
import "./components/zh-contextmenu";

import "bootstrap-css-only/css/bootstrap.min.css"

document.addEventListener("contextmenu", (e: any) => {
    $(e.target).addClass("hover");

    let observer: any = null;
    function removeHoverEl() {
        if ($(".context-menu-list").length === 0) {
            $(".zh-contextmenu").removeClass("hover");

            if (observer !== null) {
                observer.disconnect();
            }
        }
    }

    observer = new MutationObserver(removeHoverEl);
    observer.observe(document.body,  { attributes: true, childList: true });
});

const Layout = {
    view(vnode: any) {
        return m("#app", [
            m("header.navbar.navbar-expand-lg.navbar-light.bg-light", [
                m("span.navbar-brand", "Chinese Viewer"),
                m("button.navbar-toggler", {
                    "data-toggle": "collapse",
                    "data-target": "#navbarMain",
                    "aria-controls": "navbarMain",
                    "aria-expanded": false,
                    "aria-label": "Toggle navigation"
                }, [
                    m("span.navbar-toggler-icon"),
                ]),
                m("#navbarMain.collapse.navbar-collapse", [
                    m(NavbarLeft, {current: vnode.attrs.current}),
                    // m(NavbarRight)
                ]),
            ]),
            m(".container.mt-3", [
                m("i", [
                    m(".d-inline", "Right click for more options, including speech powered by "),
                    m(".d-inline", {
                        innerHTML: '<a href="https://responsivevoice.org">ResponsiveVoice-NonCommercial</a> licensed under <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img title="ResponsiveVoice Text To Speech" src="https://responsivevoice.org/wp-content/uploads/2014/08/95x15.png" alt="95x15" width="95" height="15" />'
                    })
                ]),
                vnode.children
            ])
        ]);
    }
};

m.route(document.getElementById("App")!, "/", {
    "/": { view: () => m(Layout, {current: "Home"}, m(Home)) },
    "/Home": { view: () => m(Layout, {current: "Home"}, m(Home)) },
    "/Hanzi": { view: () => m(Layout, {current: "Hanzi"}, m(Hanzi)) },
    "/Vocab": { view: () => m(Layout, {current: "Vocab"}, m(Vocab)) },
});
