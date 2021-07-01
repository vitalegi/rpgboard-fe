import { factory } from "@/utils/ConfigLog4j";
import DiceRolls from "@/utils/DiceRolls";
import NumberUtil from "@/utils/NumberUtil";
const logger = factory.getLogger("Services.EvalFormulaService");

class EvalFormulaService {
  public evaluate(
    formula: string,
    placeholders: Map<string, number>,
    allowDiceRolls: boolean
  ): Promise<number> {
    let startIndex = 0;
    const promises = new Array<Promise<number>>();
    while (formula.indexOf("+", startIndex) !== -1) {
      const endIndex = formula.indexOf("+", startIndex);
      const subset = formula.substring(startIndex, endIndex);
      promises.push(this.parse(subset, placeholders, allowDiceRolls));
      logger.debug(`subset ${subset}`);
      startIndex = endIndex + 1;
    }
    const subset = formula.substring(startIndex);
    promises.push(this.parse(subset, placeholders, allowDiceRolls));
    return Promise.all(promises).then((values) =>
      values.reduce((prev: number, curr: number) => prev + curr)
    );
  }
  protected parse(
    value: string,
    placeholders: Map<string, number>,
    allowDiceRolls: boolean
  ): Promise<number> {
    if (this.isPlaceholder(value, placeholders)) {
      return this.parsePlaceholder(value, placeholders);
    }
    if (this.isNumber(value)) {
      return this.parseNumber(value);
    }
    if (allowDiceRolls && this.isDiceRoll(value)) {
      return this.parseDiceRoll(value);
    }
    return Promise.reject(`Formula ${value} is not parsable.`);
  }
  protected isPlaceholder(
    value: string,
    placeholders: Map<string, number>
  ): boolean {
    value = value.trim().toUpperCase();
    const result = placeholders.get(value);
    return result !== undefined;
  }
  protected parsePlaceholder(
    value: string,
    placeholders: Map<string, number>
  ): Promise<number> {
    value = value.trim().toUpperCase();
    const result = placeholders.get(value);
    if (result === undefined) {
      return Promise.reject(`${value} is not a placeholder.`);
    } else {
      return Promise.resolve(result);
    }
  }
  protected isNumber(value: string): boolean {
    return NumberUtil.isNumber(value);
  }
  protected parseNumber(value: string): Promise<number> {
    return Promise.resolve(NumberUtil.parse(value));
  }
  protected isDiceRoll(value: string): boolean {
    const diceIndex = value.indexOf("d");
    if (diceIndex === -1) {
      return false;
    }
    let diceCount = value.substring(0, diceIndex).trim();
    if (diceCount === "") {
      diceCount = "1";
    }
    let diceType = value.substring(diceIndex + 1).trim();
    if (diceType === "") {
      diceType = "0";
    }
    if (!NumberUtil.isNumber(diceCount)) {
      return false;
    }
    if (!NumberUtil.isNumber(diceType)) {
      return false;
    }
    return true;
  }
  protected parseDiceRoll(value: string): Promise<number> {
    const diceIndex = value.indexOf("d");
    if (diceIndex === -1) {
      Promise.reject(`${value} is not a dice roll.`);
    }
    let diceCount = value.substring(0, diceIndex).trim();
    if (diceCount === "") {
      diceCount = "1";
    }
    let diceType = value.substring(diceIndex + 1).trim();
    if (diceType === "") {
      diceType = "0";
    }
    const dices = NumberUtil.parse(diceCount);
    const type = NumberUtil.parse(diceType);
    logger.debug(`parseDiceRoll ${value}: ${dices}d${type}`);
    return Promise.resolve(
      DiceRolls.roll(dices, type).then((values) =>
        values.reduce((prev, curr) => prev + curr)
      )
    );
  }
}

const evalFormulaService = new EvalFormulaService();
export default evalFormulaService;
