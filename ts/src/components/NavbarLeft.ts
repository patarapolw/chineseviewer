import * as m from "mithril";

import { postJson } from "../utils";

const NavItem = {
    view(vnode: any) {
        const name: string = vnode.attrs.name;
        const current: string = vnode.attrs.current;

        return m("li.nav-item" + (name === current ? ".active" : ""), [
            m("a.nav-link", {
                href: `#!/${name}`
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
        ]);
    }
};
