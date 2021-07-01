import random from "@/utils/RandomUtil";

export default class DiceRolls {
  public static roll(dices: number, type: number): Promise<number[]> {
    const values = new Array<number>();
    for (let i = 0; i < dices; i++) {
      values[i] = DiceRolls.randomInt(type);
    }
    return Promise.resolve(values);
  }

  protected static randomInt(value: number): number {
    return 1 + random(value);
  }
}
