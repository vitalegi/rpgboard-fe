import Stats, { Stat } from "@/dd5e/models/Stats";
import Player from "@/dd5e/models/Player";
import { factory } from "@/utils/ConfigLog4j";
import evalFormulaService from "../../services/EvalFormulaService";
const logger = factory.getLogger("Services.DD5e.StatsRetrieverService");

class StatsRetrieverService {
  private static STR = "STR";
  private static DEX = "DEX";
  private static COS = "COS";
  private static INT = "INT";
  private static WIS = "WIS";
  private static CHA = "CHA";

  public getStatKeys(): string[] {
    return [
      StatsRetrieverService.STR,
      StatsRetrieverService.DEX,
      StatsRetrieverService.COS,
      StatsRetrieverService.INT,
      StatsRetrieverService.WIS,
      StatsRetrieverService.CHA,
    ];
  }

  public evaluateStat(stat: Stat, player: Player): number {
    if (stat.useFormula) {
      return evalFormulaService.evaluateWithoutRolls(
        stat.formula,
        this.initPlaceholders(player)
      );
    }
    return stat.value;
  }
  public evaluateStatModifier(stat: Stat, player: Player): number {
    const value = this.evaluateStat(stat, player);
    const modifier = this.getModifier(value);
    const proficiency = this.getStatProficiency(stat, player.proficiencyBonus);
    return modifier + proficiency;
  }
  public evaluateFormula(formula: string, player: Player): Promise<number> {
    return evalFormulaService.evaluateWithRolls(
      formula,
      this.initPlaceholders(player)
    );
  }

  public getModifier(value: number): number {
    return Math.floor((value - 10) / 2);
  }
  protected initPlaceholders(player: Player): Map<string, number> {
    const values = new Map<string, number>();
    const t = player.savingThrows;
    const bonus = player.proficiencyBonus;
    values.set("STR", player.baseStats.strength.value);
    values.set("STR*", this.getStatProficiency(t.strength, bonus));
    values.set("DEX", player.baseStats.dexterity.value);
    values.set("DEX*", this.getStatProficiency(t.dexterity, bonus));
    values.set("COS", player.baseStats.constitution.value);
    values.set("COS*", this.getStatProficiency(t.constitution, bonus));
    values.set("INT", player.baseStats.intelligence.value);
    values.set("INT*", this.getStatProficiency(t.intelligence, bonus));
    values.set("WIS", player.baseStats.wisdom.value);
    values.set("WIS*", this.getStatProficiency(t.wisdom, bonus));
    values.set("CHA", player.baseStats.charisma.value);
    values.set("CHA*", this.getStatProficiency(t.charisma, bonus));
    values.set("PROFICIENCY", bonus);
    return values;
  }
  protected getStatProficiency(stat: Stat, proficiency: number): number {
    if (stat.proficiency) {
      return proficiency;
    }
    return 0;
  }

  public getStat(stats: Stats, ability: string): Stat {
    switch (ability.toUpperCase()) {
      case StatsRetrieverService.STR:
        return stats.strength;
      case StatsRetrieverService.DEX:
        return stats.dexterity;
      case StatsRetrieverService.COS:
        return stats.constitution;
      case StatsRetrieverService.INT:
        return stats.intelligence;
      case StatsRetrieverService.WIS:
        return stats.wisdom;
      case StatsRetrieverService.CHA:
        return stats.charisma;
    }
    throw new Error(`Ability ${ability} is not acceptable`);
  }
}

const statsRetrieverService = new StatsRetrieverService();
export default statsRetrieverService;
