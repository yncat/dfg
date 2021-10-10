import * as Colyseus from "colyseus.js";
import { GameState } from "./schema-def/GameState";
import { GameStateDTO } from "./gameState";
import { Pubsub } from "./pubsub";

export interface Pubsubs {
  stateUpdate: Pubsub<GameStateDTO>;
  gameOwnerStatus: Pubsub<boolean>;
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
      stateUpdate: new Pubsub<GameState>(),
      gameOwnerStatus: new Pubsub<boolean>(),
    };
  }

  public registerRoom(room: Colyseus.Room): void {
    room.onStateChange((state: GameState) => {
      // 昔はstateをそのまま使っていた。が、どうやら colyseus はインスタンスの再生成をしないらしいので、 react でうまく後進を拾ってくれなかった。
      // そのへんのライフサイクルをいい感じにコントロールできるように、毎回DTOに詰め替える。
      this.pubsubs.stateUpdate.publish(new GameStateDTO(state));
    });
    room.onMessage("GameMasterMessage", () => {
      this.pubsubs.gameOwnerStatus.publish(true);
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
