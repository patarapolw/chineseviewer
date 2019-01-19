import * as auth0 from 'auth0-js';
import * as m from "mithril";
import * as jwt from "jsonwebtoken";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'chineseviewer.auth0.com',
    clientID: 'BwVoQwjtDqUADIUrpbGbHhbVdUacwwxz',
    redirectUri: 'http://localhost:3000/#!/callback',
    responseType: 'token id_token',
    scope: 'openid profile'
  });

  login() {
    this.auth0.authorize();
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    
    m.route.set('/');
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        m.route.set('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  isAuthenticated() {
    return new Date().getTime() < this.getExpiresAt();
  }

  setSession(authResult: any) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt));

    // navigate to the home route
    m.route.set('/');
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.errorDescription}).`);
       }
    });
  }

  getAccessToken() {
      return localStorage.getItem("access_token");
  }

  getJwt(): any {
      const idToken = localStorage.getItem("id_token");
      if (idToken !== null) {
          return jwt.decode(idToken);
      }
      return null
  }

  getExpiresAt(): number {
      return JSON.parse(localStorage.getItem("expires_at") || "-1");
  }
}