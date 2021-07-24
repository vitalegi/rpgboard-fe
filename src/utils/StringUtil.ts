import StatRetriever from "@/dd5e/models/StatRetriever";
import router from "@/router";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Utils.StringUtil");

export default class StringUtil {
  public static replaceAll(
    str: string,
    searchValue: string,
    replaceValue: string
  ): string {
    let prev = null;
    do {
      prev = str;
      str = str.replace(searchValue, replaceValue);
    } while (prev != str);
    return str;
  }
}
