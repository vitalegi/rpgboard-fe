import { random } from "@/utils/RandomUtil";

export class ArrayUtil {
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
}
