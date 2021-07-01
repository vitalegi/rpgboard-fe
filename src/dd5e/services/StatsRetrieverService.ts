import BaseStats from "@/dd5e/models/BaseStats";
import { factory } from "@/utils/ConfigLog4j";
import evalFormulaService from "../../services/EvalFormulaService";
const logger = factory.getLogger("Services.DD5e.StatsRetrieverService");

class StatsRetrieverService {
  public evaluateFormula(
    baseStats: BaseStats,
    formula: string
  ): Promise<number> {
    return evalFormulaService.evaluate(
      formula,
      this.convertBaseStats(baseStats),
      true
    );
  }
  protected convertBaseStats(stats: BaseStats): Map<string, number> {
    const values = new Map<string, number>();
    values.set("STR", stats.strength);
    values.set("DEX", stats.dexterity);
    values.set("COS", stats.constitution);
    values.set("INT", stats.intelligence);
    values.set("WIS", stats.wisdom);
    values.set("CHA", stats.charisma);
    return values;
  }
}

const statsRetrieverService = new StatsRetrieverService();
export default statsRetrieverService;
