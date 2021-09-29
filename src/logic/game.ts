import * as Colyseus from "colyseus.js";
import { GameState } from "./schema-def/GameState";
import { Pubsub } from "./pubsub";

export type StateUpdateSubscriber = (state: GameState) => void;

export interface Pubsubs {
  stateUpdate: Pubsub<StateUpdateSubscriber>;
}

export interface GameLogic {
  pubsubs: Pubsubs;
  registerRoom: (room: Colyseus.Room) => void;
  unregisterRoom: () => void;
  fetchLatestState: () => GameState;
}

class GameLogicImple implements GameLogic {
  pubsubs: Pubsubs;
  private room: Colyseus.Room | null;
  latestState: GameState;

  constructor() {
    this.room = null;
    this.latestState = new GameState(); // just for making sure that it is not null
    this.pubsubs = {
      stateUpdate: new Pubsub<StateUpdateSubscriber>(),
    };
  }

  public registerRoom(room: Colyseus.Room): void {
    room.onStateChange((state: GameState) => {
      this.latestState = state;
      this.pubsubs.stateUpdate.publish(state);
    });
    this.room = room;
  }

  public unregisterRoom(): void {
    this.room = null;
  }

  public fetchLatestState(): GameState {
    return this.latestState;
  }
}

export function createGameLogic(): GameLogic {
  return new GameLogicImple();
}
