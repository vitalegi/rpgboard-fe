import { GameType } from "@/models/Types";
import { factory } from "@/utils/ConfigLog4j";
import { Service } from "typedi";
const logger = factory.getLogger("Service.GameTypeService");

type GameTypeLabel = { type: GameType; label: string };
const gameTypeLabels = new Array<GameTypeLabel>();
gameTypeLabels.push({ type: "DD5e", label: "D&D 5e" });
gameTypeLabels.push({ type: "Fiasko", label: "Fiasko" });

@Service()
export default class GameTypeService {
  public getLabels(): Array<string> {
    return gameTypeLabels.map((e) => e.label);
  }
  public mapLabelToType(label: string): GameType {
    const type = gameTypeLabels.find((e) => e.label == label)?.type;
    if (type == undefined) {
      throw Error(`Unknown label ${label}, not a game type.`);
    }
    return type;
  }
}
