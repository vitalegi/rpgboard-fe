import random from "@/utils/RandomUtil";

export default class ArrayUtil {
  public static shuffle = function <E>(list: E[]): E[] {
    const newList = new Array<E>();
    const oldList = ArrayUtil.copyList(list);
    while (oldList.length > 0) {
      const index = random(oldList.length);
      const v = oldList.splice(index, 1)[0];
      newList.push(v);
    }
    return newList;
  };
  public static copyList = function <E>(list: E[]): E[] {
    const newList = new Array<E>();
    list.forEach((e) => newList.push(e));
    return newList;
  };
  public static removeAll = function <E>(list: E[]): E[] {
    return list.splice(0);
  };
  public static toString = function <E>(list: E[] | undefined | null): string {
    if (list == undefined) {
      return "undefined";
    }
    if (list == null) {
      return "null";
    }
    return list.join(", ");
  };
}
