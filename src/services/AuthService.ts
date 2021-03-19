import User from "@/models/User";
import guestAuthService from "@/services/GuestAuthService";
import RouterUtil from "@/utils/RouterUtil";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Services.AuthService");

class AuthService {
  public guestLogin(name: string): void {
    const promise = guestAuthService.login(name);
    this.doLogin(promise);
  }

  protected doLogin(promise: Promise<User>) {
    promise.then(
      (user: User) => {
        logger.info(`login completed, user: ${user}`);
        RouterUtil.homeView();
      },
      (reason: any) => {
        logger.error(`login failed`, reason);
      }
    );
  }

  public isAuthenticated(): boolean {
    return guestAuthService.isAuthenticated();
  }
}

const authService = new AuthService();
export default authService;
