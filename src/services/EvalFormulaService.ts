import { factory } from "@/utils/ConfigLog4j";
import DiceRolls from "@/utils/DiceRolls";
import NumberUtil from "@/utils/NumberUtil";
const logger = factory.getLogger("Services.EvalFormulaService");

interface Parser {
  isParsable(value: string): boolean;
  parse(value: string): number | Promise<number>;
  printable(value: string): number | string;
}

class NumberParser implements Parser {
  public isParsable(value: string): boolean {
    return NumberUtil.isNumber(value);
  }
  public parse(value: string): number {
    return NumberUtil.parse(value);
  }
  public printable(value: string): number {
    return this.parse(value);
  }
}
class PlaceholderParser implements Parser {
  private _placeholders;
  public constructor(placeholders: Map<string, number>) {
    this._placeholders = placeholders;
  }
  public isParsable(value: string): boolean {
    value = value.trim().toUpperCase();
    const result = this._placeholders.get(value);
    return result !== undefined;
  }
  public parse(value: string): number {
    value = value.trim().toUpperCase();
    const result = this._placeholders.get(value);
    if (result === undefined) {
      throw new Error(`${value} is not a placeholder.`);
    } else {
      return result;
    }
  }
  public printable(value: string): number {
    return this.parse(value);
  }
}

class DiceParser implements Parser {
  public isParsable(value: string): boolean {
    try {
      const dices = this.getDiceCount(value);
      const type = this.getDiceType(value);
      return true;
    } catch (e) {
      return false;
    }
  }
  public parse(value: string): Promise<number> {
    try {
      const dices = this.getDiceCount(value);
      const type = this.getDiceType(value);
      logger.debug(`parseDiceRoll ${value}: ${dices}d${type}`);
      return Promise.resolve(
        DiceRolls.roll(dices, type).then((values) =>
          values.reduce((prev, curr) => prev + curr, 0)
        )
      );
    } catch (e) {
      return Promise.reject(`${value} is not a dice roll.`);
    }
  }
  public printable(value: string): number | string {
    const dices = this.getDiceCount(value);
    const type = this.getDiceType(value);
    return `${dices}d${type}`;
  }
  protected getDiceCount(value: string): number {
    const diceIndex = this.getDiceIndex(value);
    let diceCount = value.substring(0, diceIndex).trim();
    if (diceCount === "") {
      diceCount = "1";
    }
    return NumberUtil.parse(diceCount);
  }
  protected getDiceType(value: string): number {
    const diceIndex = this.getDiceIndex(value);
    let diceType = value.substring(diceIndex + 1).trim();
    if (diceType === "") {
      diceType = "0";
    }
    return NumberUtil.parse(diceType);
  }
  protected getDiceIndex(value: string): number {
    const diceIndex = value.indexOf("d");
    if (diceIndex === -1) {
      throw new Error(`${value} is not a dice roll.`);
    }
    return diceIndex;
  }
}

class EvalFormulaService {
  public evaluateWithRolls(
    formula: string,
    placeholders: Map<string, number>
  ): Promise<number> {
    const elements = this.splitFormula(formula);
    const parsers = [
      new NumberParser(),
      new PlaceholderParser(placeholders),
      new DiceParser(),
    ];
    const promises = elements
      .map((element) => {
        const parser = this.getParser(parsers, element);
        return parser.parse(element);
      })
      .map((value) => {
        if (typeof value === "number") {
          return Promise.resolve(value);
        }
        return value as Promise<number>;
      });
    return Promise.all(promises).then((values) =>
      values.reduce((prev: number, curr: number) => prev + curr, 0)
    );
  }
  public evaluateWithoutRolls(
    formula: string,
    placeholders: Map<string, number>
  ): number {
    const elements = this.splitFormula(formula);
    const parsers = [new NumberParser(), new PlaceholderParser(placeholders)];
    const values = elements
      .map((element) => {
        const parser = this.getParser(parsers, element);
        return parser.parse(element);
      })
      .map((value) => value as number);
    return values.reduce((prev: number, curr: number) => prev + curr, 0);
  }
  public printableFormula(
    formula: string,
    placeholders: Map<string, number>
  ): string {
    const elements = this.splitFormula(formula);
    const parsers = [
      new NumberParser(),
      new PlaceholderParser(placeholders),
      new DiceParser(),
    ];
    const printable = elements.map((element) => {
      const parser = this.getParser(parsers, element);
      return parser.printable(element);
    });
    const value = printable
      .filter((v) => typeof v === "number")
      .map((v) => v as number)
      .reduce((prev: number, curr: number) => prev + curr, 0);

    const dice = printable
      .filter((v) => typeof v === "string")
      .map((v) => v as string);

    if (value !== 0) {
      return ["" + value, ...dice].join("+");
    }
    return dice.join("+");
  }
  private splitFormula(formula: string): string[] {
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
  private getParser(parsers: Parser[], value: string): Parser {
    const validParsers = parsers.filter((parser) => parser.isParsable(value));
    if (validParsers.length === 0) {
      throw new Error(`Formula ${value} is not parsable.`);
    }
    return validParsers[0];
  }
}

const evalFormulaService = new EvalFormulaService();
export default evalFormulaService;
