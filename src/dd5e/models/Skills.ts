import { Stat } from "./Stats";

export class Skill extends Stat {
  public id = "";

  public static createSkill(id: string, formula: string) {
    const skill = new Skill();
    skill.id = id;
    skill.useFormula = true;
    skill.formula = formula;
    return skill;
  }
}

export default class Skills {
  public acrobatics = Stat._createSkill("DEX");
  public animalHandling = Stat._createSkill("WIS");
  public arcana = Stat._createSkill("INT");
  public athletics = Stat._createSkill("STR");
  public deception = Stat._createSkill("CHA");
  public history = Stat._createSkill("INT");
  public insight = Stat._createSkill("WIS");
  public intimidation = Stat._createSkill("CHA");
  public investigation = Stat._createSkill("INT");
  public medicine = Stat._createSkill("WIS");
  public nature = Stat._createSkill("INT");
  public perception = Stat._createSkill("WIS");
  public performance = Stat._createSkill("CHA");
  public persuasion = Stat._createSkill("CHA");
  public religion = Stat._createSkill("INT");
  public sleightOfHand = Stat._createSkill("DEX");
  public stealth = Stat._createSkill("DEX");
  public survival = Stat._createSkill("WIS");
}
