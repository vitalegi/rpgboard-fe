import { Inject, Service } from "typedi";
import firebase from "firebase/app";
import { factory } from "@/utils/ConfigLog4j";
import store from "@/store";
import { cookieUtil } from "@/utils/CookieUtil";
const logger = factory.getLogger("Login.Services.AuthService");

@Service()
export default class AuthService {
  public async signup(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    this.successfulLogin(user);
    logger.info("sign up done");
    await firebase.auth().currentUser?.sendEmailVerification();
    logger.info("notification sent");
    return user;
  }
  public async login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    this.successfulLogin(user);

    return user;
  }
  public loginFacebook(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithRedirect(provider);
  }
  protected successfulLogin(credential: firebase.auth.UserCredential): void {
    store.commit("auth/login", this.getUserId());
  }
  public async getIdToken(): Promise<string> {
    const user = firebase.auth().currentUser;
    if (user === null) {
      throw new Error("User not authenticated");
    }
    return await user.getIdToken(/* forceRefresh */ true);
  }
  public isAuthenticated(): boolean {
    return (
      firebase.auth().currentUser !== null ||
      cookieUtil.getCookie("USERID") !== ""
    );
  }
  public getUserId(): string {
    const user = firebase.auth().currentUser;
    if (user === null) {
      throw new Error("User not authenticated");
    }
    return user.uid;
  }
  public async logout(): Promise<void> {
    await firebase.auth().signOut();
    return Promise.resolve();
  }
}
