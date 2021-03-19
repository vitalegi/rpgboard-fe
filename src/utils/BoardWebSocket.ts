import { websocket } from "@/utils/WebSocket";

import eventBus from "@/utils/EventBus";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Utils.BoardWebSocket");

class BoardWebSocket {
  public startPolling = (boardId: number, playerId: number) => {
    logger.info(`Start polling for ${boardId} ${playerId}`);
    this.releaseResources(boardId);

    if (!websocket.isConnected()) {
      logger.error(`WebSocket not connected`);
      return;
    }
    websocket.subscribe(
      `/topic/boards/${boardId}`,
      (msg) => {
        logger.info(
          `Received msg on topic ${msg.headers.destination} - ${msg.body}`
        );
        this.sync(boardId, playerId);
      },
      { id: `/topic/boards/${boardId}` }
    );
    this.sync(boardId, playerId);
  };

  public stopPolling = (boardId: number) => {
    logger.info(`Stop polling`);
    this.releaseResources(boardId);
  };

  protected releaseResources = (boardId: number) => {
    websocket.unsubscribe(`/topic/boards/${boardId}`);
    logger.info(`Subscription released`);
  };
  public async sync(boardId: number, playerId: number) {
    logger.info(`Sync for ${boardId} ${playerId}`);
    eventBus.$emit("GAME_BOARD", "tmp");
  }
}

export const boardWebSocket = new BoardWebSocket();
