import { Skill } from "@/dd5e/models/Skills";
import Player from "@/dd5e/models/Player";
import SkillKeys from "../constants/SkillKeys";

class SkillService {
  public getSkill(id: string, player: Player): Skill {
    const skill = player.skills.filter((skill) => skill.id === id);
    if (skill.length > 0) {
      return skill[0];
    }
    throw new Error(`Skill ${id} not found`);
  }
  public createSkills(): Array<Skill> {
    return SkillKeys.keys().map((id) =>
      Skill.createSkill(id, SkillKeys.stat(id))
    );
  }
  public getUsedStat(id: string): string {
    return SkillKeys.stat(id);
  }
}

const skillService = new SkillService();
export default skillService;
