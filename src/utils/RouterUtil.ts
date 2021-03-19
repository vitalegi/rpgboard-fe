import router from "@/router";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Utils.RouterUtil");

export default class RouterUtil {
  public static toLogin(): void {
    router.push({
      name: "Login",
    });
  }
  public static toHome(): void {
    router.push({
      name: "Home",
    });
  }
  public static toGame(gameId: string): void {
    router.push({
      name: "Game",
      params: { gameId: gameId },
    });
  }
}
