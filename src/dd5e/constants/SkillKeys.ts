const SKILLS = [
  { id: "ACROBATICS", stat: "DEX" },
  { id: "ANIMAL_HANDLING", stat: "WIS" },
  { id: "ARCANA", stat: "INT" },
  { id: "ATHLETICS", stat: "STR" },
  { id: "DECEPTION", stat: "CHA" },
  { id: "HISTORY", stat: "INT" },
  { id: "INSIGHT", stat: "WIS" },
  { id: "INTIMIDATION", stat: "CHA" },
  { id: "INVESTIGATION", stat: "INT" },
  { id: "MEDICINE", stat: "WIS" },
  { id: "NATURE", stat: "INT" },
  { id: "PERCEPTION", stat: "WIS" },
  { id: "PERFORMANCE", stat: "CHA" },
  { id: "PERSUASION", stat: "CHA" },
  { id: "RELIGION", stat: "INT" },
  { id: "SLEIGHT_OF_HAND", stat: "DEX" },
  { id: "STEALTH", stat: "DEX" },
  { id: "SURVIVAL", stat: "WIS" },
];

export default class SkillKeys {
  public static ACROBATICS = "ACROBATICS";
  public static ANIMAL_HANDLING = "ANIMAL_HANDLING";
  public static ARCANA = "ARCANA";
  public static ATHLETICS = "ATHLETICS";
  public static DECEPTION = "DECEPTION";
  public static HISTORY = "HISTORY";
  public static INSIGHT = "INSIGHT";
  public static INTIMIDATION = "INTIMIDATION";
  public static INVESTIGATION = "INVESTIGATION";
  public static MEDICINE = "MEDICINE";
  public static NATURE = "NATURE";
  public static PERCEPTION = "PERCEPTION";
  public static PERFORMANCE = "PERFORMANCE";
  public static PERSUASION = "PERSUASION";
  public static RELIGION = "RELIGION";
  public static SLEIGHT_OF_HAND = "SLEIGHT_OF_HAND";
  public static STEALTH = "STEALTH";
  public static SURVIVAL = "SURVIVAL";

  public static keys(): string[] {
    return SKILLS.map((skill) => skill.id);
  }

  public static stat(id: string): string {
    const entry = SKILLS.filter((skill) => skill.id === id).map(
      (skill) => skill.stat
    );

    if (entry.length > 0) {
      return entry[0];
    }
    throw new Error(`Skill ${id} doesn't exist.`);
  }
}
