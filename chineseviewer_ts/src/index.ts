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
                m("i", "Right click for more options"),
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
