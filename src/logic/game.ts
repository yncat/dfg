import * as Colyseus from "colyseus.js";
import { GameState } from "./schema-def/GameState";
import { Pubsub } from "./pubsub";

export interface Pubsubs {
  stateUpdate: Pubsub<GameState>;
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
      this.pubsubs.stateUpdate.publish(state);
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
