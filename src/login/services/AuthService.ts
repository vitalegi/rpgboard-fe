import firebase from "firebase/app";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Login.Services.AuthService");

class AuthService {
  public async signup(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    logger.info("sign up done");
    await firebase.auth().currentUser?.sendEmailVerification();
    logger.info("notification sent");
    return user;
  }
  public login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  public loginFacebook(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithRedirect(provider);
  }
  public async getIdToken(): Promise<string> {
    const user = firebase.auth().currentUser;
    if (user === null) {
      throw new Error("User not authenticated");
    }
    return await user.getIdToken(/* forceRefresh */ true);
  }
  public isAuthenticated(): boolean {
    return firebase.auth().currentUser !== null;
  }
  public getUserId(): string {
    const user = firebase.auth().currentUser;
    if (user === null) {
      throw new Error("User not authenticated");
    }
    return user.uid;
  }
  public async logout(): Promise<void> {
    return firebase.auth().signOut();
  }
}

const authService = new AuthService();
export default authService;
