export default class NumberUtil {
  public static parse(str: string): number {
    if (str.length === 0) {
      throw new Error(`Not a number, empty string`);
    }
    let sign = 1;
    for (let i = 0; i < str.length; i++) {
      if (i == 0 && str.charAt(i) == "+") {
        continue;
      }
      if (i == 0 && str.charAt(i) == "-") {
        sign = -1;
        continue;
      }
      if (str.charAt(i) < "0" || str.charAt(i) > "9") {
        throw new Error(`${str} is not a number.`);
      }
    }
    return sign * Number.parseInt(str, 10);
  }
  public static isNumber(str: string): boolean {
    try {
      this.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
}
