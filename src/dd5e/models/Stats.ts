export class Stat {
  public value = 0;
  public proficiency = false;
  public formula = "";
  public useFormula = false;

  public static createBaseStat(value = 0): Stat {
    const stat = new Stat();
    stat.useFormula = false;
    stat.value = value;
    return stat;
  }
  public static createSavingThrow(baseStat: string, proficiency = false): Stat {
    const stat = new Stat();
    stat.useFormula = true;
    if (proficiency) {
      stat.formula = `${baseStat}`;
    } else {
      stat.formula = `${baseStat}`;
    }
    stat.proficiency = proficiency;
    return stat;
  }
  public static _createSkill(formula: string, proficiency = false): Stat {
    const stat = new Stat();
    stat.useFormula = true;
    stat.formula = formula;
    return stat;
  }
  public static createFormula(formula: string, proficiency = false): Stat {
    const stat = new Stat();
    stat.useFormula = true;
    stat.formula = formula;
    return stat;
  }
}

export default class Stats {
  public strength = Stat.createBaseStat(0);
  public dexterity = Stat.createBaseStat(0);
  public constitution = Stat.createBaseStat(0);
  public intelligence = Stat.createBaseStat(0);
  public wisdom = Stat.createBaseStat(0);
  public charisma = Stat.createBaseStat(0);
}
