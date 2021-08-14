import Container, { Inject, Service } from "typedi";
import firebase from "firebase/app";
import store from "@/store";
import { factory } from "@/utils/ConfigLog4j";
import BackendService from "@/services/BackendService";
const logger = factory.getLogger("Login.Services.AuthService");

@Service()
export default class AuthService {
  protected firstAccess = true;

  public async signup(
    email: string,
    username: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    const credentials = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    await this.backendService().registerUser(username);

    if (credentials.user) {
      await this.successfulLogin(credentials.user);
    }
    logger.info("sign up done");
    await firebase.auth().currentUser?.sendEmailVerification();
    logger.info("notification sent");
    return credentials;
  }
  public async login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    const credentials = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (credentials.user) {
      await this.successfulLogin(credentials.user);
    }
    return credentials;
  }
  // not used, not working
  public loginFacebook(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithRedirect(provider);
  }
  public async successfulLogin(user: firebase.User): Promise<void> {
    store.commit("auth/login", user);
    store.commit(
      "auth/localUser",
      await this.backendService().getCurrentUser()
    );
  }
  public async getIdToken(): Promise<string> {
    return (await this.getUser()).getIdToken();
  }

  protected async getUser(): Promise<firebase.User> {
    const firstAccess = this.firstAccess;
    this.firstAccess = false;
    return this.getUserWithRetries(firstAccess);
  }

  protected async getUserWithRetries(
    firstAccess: boolean,
    retry = 0
  ): Promise<firebase.User> {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      return user;
    }
    const retries = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
    if (retry > retries.length) {
      throw new Error("User not authenticated");
    }
    if (!firstAccess) {
      throw new Error("User not authenticated, first access already done");
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (retry < 8) {
          logger.debug(`Retry attempt #${retry + 1}`);
        }
        if (retry >= 8) {
          logger.info(`Retry attempt #${retry + 1}`);
        }
        this.getUserWithRetries(firstAccess, retry + 1).then(
          (user) => resolve(user),
          (e) => reject(e)
        );
      }, retries[retry]);
    });
  }

  public async logout(): Promise<void> {
    await firebase.auth().signOut();
    store.commit("auth/logout");
    return Promise.resolve();
  }

  protected backendService() {
    return Container.get<BackendService>(BackendService);
  }
}
