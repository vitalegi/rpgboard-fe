import Stats, { Stat } from "@/dd5e/models/Stats";
import Player from "@/dd5e/models/Player";
import { factory } from "@/utils/ConfigLog4j";
import { Inject, Service } from "typedi";
import EvalFormulaService from "../../services/EvalFormulaService";
const logger = factory.getLogger("Services.DD5e.StatsRetrieverService");

@Service()
export default class StatsRetrieverService {
  private evalFormulaService: EvalFormulaService;
  private static STR = "STR";
  private static DEX = "DEX";
  private static COS = "COS";
  private static INT = "INT";
  private static WIS = "WIS";
  private static CHA = "CHA";

  public constructor(@Inject() evalFormulaService: EvalFormulaService) {
    this.evalFormulaService = evalFormulaService;
  }

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
      return this.evalFormulaService.evaluateWithoutRolls(
        stat.formula,
        this.initPlaceholders(player)
      );
    }
    return stat.value;
  }
  public evaluateStatModifier(stat: Stat, player: Player): number {
    const value = this.evaluateStat(stat, player);
    const proficiency = this.getStatProficiency(stat, player.proficiencyBonus);
    return value + proficiency;
  }
  public evaluateFormula(formula: string, player: Player): Promise<number> {
    return this.evalFormulaService.evaluateWithRolls(
      formula,
      this.initPlaceholders(player)
    );
  }
  public printableFormula(formula: string, player: Player): string {
    return this.evalFormulaService.printableFormula(
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
    for (const statName of this.getStatKeys()) {
      const value = this.getStat(player.baseStats, statName).value;
      values.set(statName, this.getModifier(value));
      const saveStat = this.getStat(player.savingThrows, statName);
      values.set(`${statName}*`, this.getStatProficiency(saveStat, bonus));
    }
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
