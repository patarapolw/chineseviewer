import * as m from "mithril";

const NavItem = {
    view(vnode: any) {
        const name: string = vnode.attrs.name;
        const current: string = vnode.attrs.current;

        return m("li.nav-item" + (name === current ? ".active" : ""), [
            m(".nav-link", {
                onclick(e: any) {
                    m.route.set("/" + name);
                }
            }, name)
        ]);
    }
};

export default {
    view(vnode: any) {
        return m("ul.navbar-nav.mr-auto", [
            m(NavItem, {name: "Home", current: vnode.attrs.current}),
            m(NavItem, {name: "Hanzi", current: vnode.attrs.current}),
            m(NavItem, {name: "Vocab", current: vnode.attrs.current}),
            m("li.nav-item", [
                m("a.nav-link", {
                    href: "https://github.com/patarapolw/chineseviewer-v2"
                }, "GitHub")
            ])
        ]);
    }
};
