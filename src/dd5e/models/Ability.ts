export class SavingThrowCondition {
  public dcFormula = "";
  public targetFormula = "";
  public saveEffect = "";
}

export class Damage {
  public formula = "";
  public type = "";

  public constructor(formula = "", type = "") {
    this.formula = formula;
    this.type = type;
  }
}

export default class Ability {
  public id = 0;
  public type = "ATTACK";
  public name = "";
  public attackFormula = "";
  public range = "";
  public damages = new Array<Damage>();
  public savingThrow: null | SavingThrowCondition = null;
  public description = "";
}

export class Spell extends Ability {
  public components = "";
  public castingTime = "";
  public duration = "";
  public spellSlot = 0;

  public constructor() {
    super();
    this.type = "SPELL";
  }
}
