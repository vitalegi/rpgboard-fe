import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Services.DiceRollService");

class DiceRoll {
  formula;
  dice = new Array<number>();
  result;
  description;

  public constructor(formula: string, result: number, descripion: string) {
    this.formula = formula;
    this.result = result;
    this.description = descripion;
  }
}

class DiceRollService {
  public roll(dice: string): void {
    console.log("TMP");
  }

  protected processQuery(dice: string): Array<DiceRoll> {
    const processed = new Array<DiceRoll>();
    dice.split("|").map((str) => str.trim());
    return processed;
  }
}

const diceRollService = new DiceRollService();
export default diceRollService;
