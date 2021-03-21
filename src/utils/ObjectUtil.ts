export default class ObjectUtil {
  public static hardCopy<E>(obj: E): E {
    return JSON.parse(JSON.stringify(obj));
  }

  public static shallowCopy<E>(obj: E): E {
    return { ...obj };
  }
}
