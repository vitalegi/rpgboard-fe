import EventBus from "vertx3-eventbus-client";
import { Service } from "typedi";
import DataMapper from "./DataMapper";
import AuthService from "@/login/services/AuthService";
import { default as VueEventBus } from "@/utils/EventBus";
import { factory } from "@/utils/ConfigLog4j";
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

  public async init(onopen: () => any) {
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
      onopen();
    };
    this.eventBus.onerror = (error) => {
      logger.error("WebSocket error", error);
    };
    this.eventBus.onclose = () => {
      logger.info("Close connection");
    };
  }
  public async register(address: string) {
    logger.info(`register ${address}`);
    const token = await this.authService.getIdToken();
    this.eventBus?.registerHandler(
      address,
      { Authorization: token },
      this.messageHandler
    );
  }

  public async unregister(address: string) {
    logger.info(`unregister ${address}`);
    const token = await this.authService.getIdToken();
    this.eventBus?.unregisterHandler(address, { Authorization: token });
  }

  protected messageHandler(error: Error | null, message: any) {
    if (error !== null) {
      logger.error("Received a websocket error", error);
    } else {
      const target = `${message.body.gameId}.${message.body.topic}`;
      logger.debug(`Emit msg to ${target}`);
      VueEventBus.$emit(target, message.body);
    }
  }
}
