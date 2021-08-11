import EventBus from "vertx3-eventbus-client";
import Game from "@/models/Game";
import GamePlayer from "@/models/GamePlayer";
import { GameType } from "@/models/Types";
import GameStatus from "@/models/GameStatus";
import GameRole from "@/models/GameRole";
import { Service } from "typedi";
import { BackendWebService } from "@/utils/WebService";
import { factory } from "@/utils/ConfigLog4j";
import DataMapper from "./DataMapper";
import GameTypeService from "@/game/services/GameTypeService";
import AuthService from "@/login/services/AuthService";
import auth from "@/login/store/AuthStore";
const logger = factory.getLogger("Service.WebSocketClient");

@Service()
export default class BackendService {
  protected authService: AuthService;
  protected dataMapper: DataMapper;
  protected eventBus: EventBus.EventBus | null = null;

  constructor(dataMapper: DataMapper, authService: AuthService) {
    this.dataMapper = dataMapper;
    this.authService = authService;
  }

  public async init() {
    if (this.eventBus !== null) {
      logger.info("eventBus already initialized");
      return;
    }
    this.eventBus = new EventBus(`${process.env.VUE_APP_BACKEND}/eventbus`, {
      vertxbus_reconnect_attempts_max: 5,
    });
    this.eventBus.enableReconnect(true);
    this.eventBus.onopen = () => {
      logger.info("Connection established");
    };
    this.eventBus.onerror = (error) => {
      console.error("WebSocket error", error);
    };
    this.eventBus.onclose = () => {
      console.log("Close connection");
    };
  }
  public async register(
    address: string,
    callback?: (error: Error, message: any) => any
  ) {
    const token = await this.authService.getIdToken();
    this.eventBus?.registerHandler(address, { Authorization: token }, callback);
  }
}
