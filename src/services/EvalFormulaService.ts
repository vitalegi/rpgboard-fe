import { factory } from "@/utils/ConfigLog4j";
import DiceRolls from "@/utils/DiceRolls";
import NumberUtil from "@/utils/NumberUtil";
const logger = factory.getLogger("Services.EvalFormulaService");

class EvalFormulaService {
  public evaluateWithRolls(
    formula: string,
    placeholders: Map<string, number>
  ): Promise<number> {
    const elements = this.splitFormula(formula);
    const promises = new Array<Promise<number>>();
    for (const element of elements) {
      promises.push(this.parseWithRolls(element, placeholders));
    }
    return Promise.all(promises).then((values) =>
      values.reduce((prev: number, curr: number) => prev + curr)
    );
  }
  public evaluateWithoutRolls(
    formula: string,
    placeholders: Map<string, number>
  ): number {
    const elements = this.splitFormula(formula);
    return elements
      .map((el) => this.parseWithoutRolls(el, placeholders))
      .reduce((prev, curr) => prev + curr);
  }
  protected splitFormula(formula: string): string[] {
    const elements = [];
    let startIndex = 0;
    while (formula.indexOf("+", startIndex) !== -1) {
      const endIndex = formula.indexOf("+", startIndex);
      const subset = formula.substring(startIndex, endIndex);
      elements.push(subset);
      startIndex = endIndex + 1;
    }
    const subset = formula.substring(startIndex);
    elements.push(subset);
    return elements;
  }
  protected parseWithRolls(
    value: string,
    placeholders: Map<string, number>
  ): Promise<number> {
    if (this.isPlaceholder(value, placeholders)) {
      return Promise.resolve(this.parsePlaceholder(value, placeholders));
    }
    if (this.isNumber(value)) {
      return Promise.resolve(this.parseNumber(value));
    }
    if (this.isDiceRoll(value)) {
      return this.parseDiceRoll(value);
    }
    return Promise.reject(`Formula ${value} is not parsable.`);
  }
  protected parseWithoutRolls(
    value: string,
    placeholders: Map<string, number>
  ): number {
    if (this.isPlaceholder(value, placeholders)) {
      return this.parsePlaceholder(value, placeholders);
    }
    if (this.isNumber(value)) {
      return this.parseNumber(value);
    }
    throw new Error(`Formula ${value} is not parsable.`);
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
  ): number {
    value = value.trim().toUpperCase();
    const result = placeholders.get(value);
    if (result === undefined) {
      throw new Error(`${value} is not a placeholder.`);
    } else {
      return result;
    }
  }
  protected isNumber(value: string): boolean {
    return NumberUtil.isNumber(value);
  }
  protected parseNumber(value: string): number {
    return NumberUtil.parse(value);
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
