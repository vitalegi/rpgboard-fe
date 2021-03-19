import User from "@/models/User";
import { cookieUtil } from "@/utils/CookieUtil";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Services.GuestAuthService");

const authMethod = "GUEST";

class GuestAuthService {
  public login(name: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        cookieUtil.setCookie("auth_method", authMethod);
        cookieUtil.setCookie("auth", name);
        logger.info("guest auth cookie set: " + cookieUtil.getCookies());
        resolve(new User(name, name));
      }, 1110);
    });
  }

  public isAuthenticated(): boolean {
    if (cookieUtil.getCookie("auth_method") !== authMethod) {
      return false;
    }
    if (cookieUtil.getCookie("auth") == undefined) {
      return false;
    }
    return true;
  }
}

const guestAuthService = new GuestAuthService();
export default guestAuthService;
