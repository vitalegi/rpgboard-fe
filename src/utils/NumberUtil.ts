export default class NumberUtil {
  public static parse(str: string): number {
    if (str.length === 0) {
      throw new Error(`Not a number, empty string`);
    }
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) < "0" || str.charAt(i) > "9") {
        throw new Error(`${str} is not a number.`);
      }
    }
    return Number.parseInt(str, 10);
  }
  public static isNumber(str: string): boolean {
    if (str.length === 0) {
      return false;
    }
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) < "0" || str.charAt(i) > "9") {
        return false;
      }
    }
    return true;
  }
}
