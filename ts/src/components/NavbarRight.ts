import * as m from "mithril";
import Auth from "../auth/Auth";

export default {
    view(vnode: any) {
        const auth: Auth = vnode.attrs.auth;
        const isAuthenticated = auth.isAuthenticated();
        console.log(auth.getJwt());

        return m(".navbar-nav", [
            m(".nav-item.mr-3.my-2", isAuthenticated ?`Welcome back, ${auth.getJwt()!.name}` : ""),
            m("button.btn.btn-outline-success", {
                onclick() {
                    isAuthenticated ? auth.logout() : auth.login();
                }
            }, isAuthenticated ? "Logout" : "Login for more")
        ]);
    }
};
