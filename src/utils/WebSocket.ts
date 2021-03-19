import { factory } from "@/utils/ConfigLog4j";
import SockJS from "sockjs-client";
import Stomp, {
  Client,
  Frame,
  Message,
  SubscribeHeaders,
  Subscription,
  UnsubscribeHeaders,
} from "webstomp-client";

const logger = factory.getLogger("Utils.WebSocket");

type NamedSubscription = {
  destination: string;
  id: string;
  headers: SubscribeHeaders | undefined;
  callbackFn: (message: Message) => any;
};

export class WebSocketConnector {
  private url = "";
  private socket: WebSocket | null = null;
  private stompClient: Client | null = null;
  private connected = false;
  private subscriptions = new Array<NamedSubscription>();

  public constructor(url: string) {
    this.url = url;
  }
  public connect(callbackFn?: undefined | (() => void)) {
    if (this.isConnected()) {
      logger.info(`Already connected, skip action.`);
      return;
    }
    this.subscriptions = new Array<NamedSubscription>();
    this.socket = new SockJS(this.url);
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.debug = (...args: any[]): void => {
      for (const arg of args) {
        logger.debug(arg);
      }
    };
    this.stompClient.connect(
      {},
      (frame: Frame | undefined) => {
        this.connected = true;
        logger.info(`Connection to ${this.url} is established.`);
        if (callbackFn) {
          callbackFn();
        }
      },
      (error: Frame | CloseEvent) => {
        this.connected = false;
        logger.error(error.toString());
      }
    );
  }
  public sendJson(destination: string, msg: any) {
    if (this.isConnected()) {
      this.doSendJson(destination, msg);
    } else {
      this.connect(() => {
        this.doSendJson(destination, msg);
      });
      throw Error(`Connection is closed`);
    }
  }
  protected doSendJson(destination: string, msg: any) {
    logger.info(`Send to ${destination} message: ${JSON.stringify(msg)}`);
    this.stompClient?.send(destination, JSON.stringify(msg), {});
  }
  public isConnected(): boolean {
    if (this.connected && this.stompClient?.connected) {
      return true;
    }
    return false;
  }
  public disconnect() {
    this.connected = false;
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
  public subscribe(
    destination: string,
    callback: (message: Message) => any,
    headers?: SubscribeHeaders | undefined
  ): Subscription {
    if (!this.isConnected()) {
      throw Error(`Connection is closed`);
    }
    const subscription = (this.stompClient as Client).subscribe(
      destination,
      callback,
      headers
    );
    this.subscriptions.push({
      destination: destination,
      headers: headers,
      id: headers?.id ? headers?.id : "",
      callbackFn: callback,
    });
    logger.info(`Subscribed to ${destination}: ${subscription.id}`);
    return subscription;
  }
  public unsubscribe(id: string, header?: UnsubscribeHeaders | undefined) {
    if (!this.isConnected()) {
      return;
    }
    const index = this.subscriptions.findIndex((s) => s.id == id);
    this.subscriptions.splice(index, 1);

    this.stompClient?.unsubscribe(id, header);
    logger.info(`Unsubscribed from ${id}`);
  }
}

export const websocket = new WebSocketConnector(
  "http://localhost:8080/websocket"
);
websocket.connect();
