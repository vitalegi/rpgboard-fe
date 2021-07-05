import Skills, { Skill } from "./Skills";
import Stats, { Stat } from "./Stats";

export default class DungeonsDragons5ePG {
  public name = "";
  public alignment = "";
  public playerName = "";
  public experiencePoint = 0;
  public inspiration = 0;
  public proficiencyBonus = 0;
  public baseStats = new Stats();
  public savingThrows = new Stats();
  public skills = new Array<Skill>();
  public armorClassFormula = "";
  public initiativeFormula = "";
  public speed = 0;

  public constructor() {
    this.baseStats = new Stats();

    this.savingThrows = new Stats();
    this.savingThrows.strength = Stat.createSavingThrow("STR", false);
    this.savingThrows.dexterity = Stat.createSavingThrow("DEX", false);
    this.savingThrows.constitution = Stat.createSavingThrow("COS", false);
    this.savingThrows.intelligence = Stat.createSavingThrow("INT", false);
    this.savingThrows.wisdom = Stat.createSavingThrow("WIS", false);
    this.savingThrows.charisma = Stat.createSavingThrow("CHA", false);
  }
}
