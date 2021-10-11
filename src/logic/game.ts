import * as Colyseus from "colyseus.js";
import {
  PlayerJoinedMessage,
  PlayerJoinedMessageDecoder,
  decodePayload,
} from "dfg-messages";
import { GameState } from "./schema-def/GameState";
import { GameStateDTO } from "./gameState";
import { Pubsub } from "./pubsub";
import { isDecodeSuccess } from "./decodeValidator";

export interface Pubsubs {
  stateUpdate: Pubsub<GameStateDTO>;
  gameOwnerStatus: Pubsub<boolean>;
  playerJoined: Pubsub<string>;
}

export interface GameLogic {
  pubsubs: Pubsubs;
  registerRoom: (room: Colyseus.Room) => void;
  unregisterRoom: () => void;
}

class GameLogicImple implements GameLogic {
  pubsubs: Pubsubs;
  private room: Colyseus.Room | null;
  constructor() {
    this.room = null;
    this.pubsubs = {
      stateUpdate: new Pubsub<GameStateDTO>(),
      gameOwnerStatus: new Pubsub<boolean>(),
      playerJoined: new Pubsub<string>(),
    };
  }

  public registerRoom(room: Colyseus.Room): void {
    room.onStateChange((state: GameState) => {
      // 昔はstateをそのまま使っていた。が、どうやら colyseus はインスタンスの再生成をしないらしいので、 react でうまく後進を拾ってくれなかった。
      // そのへんのライフサイクルをいい感じにコントロールできるように、毎回DTOに詰め替える。
      this.pubsubs.stateUpdate.publish(new GameStateDTO(state));
    });
    room.onMessage("RoomOwnerMessage", () => {
      this.pubsubs.gameOwnerStatus.publish(true);
    });
    room.onMessage("PlayerJoinedMessage", (payload: any) => {
      const msg = decodePayload<PlayerJoinedMessage>(
        payload,
        PlayerJoinedMessageDecoder
      );
      if (!isDecodeSuccess<PlayerJoinedMessage>(msg)) {
        return;
      }
      this.pubsubs.playerJoined.publish(msg.playerName);
    });

    this.room = room;
  }

  public unregisterRoom(): void {
    this.room = null;
  }
}

export function createGameLogic(): GameLogic {
  return new GameLogicImple();
}
