import * as Colyseus from "colyseus.js";
import { GameState } from "./schema-def/gameState";

export interface GameLogic {
  registerRoom: (room: Colyseus.Room) => void;
  unregisterRoom: () => void;
  fetchLatestState: () => GameState;
}

class GameLogicImple implements GameLogic {
  private room: Colyseus.Room | null;
  latestState: GameState;

  constructor() {
    this.room = null;
    this.latestState = new GameState(); // just for making sure that it is not null
  }

  public registerRoom(room: Colyseus.Room): void {
    this.room = room;
  }

  public unregisterRoom(room: Colyseus.Room): void {
    this.room = null;
  }

  public fetchLatestState(): GameState {
    return this.latestState;
  }
}

export function createGameLogic(): GameLogic {
  return new GameLogicImple();
}
