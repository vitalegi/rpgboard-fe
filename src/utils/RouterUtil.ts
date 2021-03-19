import router from "@/router";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Utils.RouterUtil");

export default class RouterUtil {
  public static loginView(): void {
    router.push({
      name: "Login",
    });
  }
  public static homeView(): void {
    router.push({
      name: "Home",
    });
  }
  public static navPlayGame(tableId: number, playerId: number): void {
    router.push({
      name: "PlayGame",
      params: { tableId: "" + tableId, playerId: "" + playerId },
    });
  }
}
