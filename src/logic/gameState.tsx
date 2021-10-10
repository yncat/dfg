import { ArraySchema } from "@colyseus/schema";
import { GameState } from "./schema-def/GameState";
import { Result } from "./schema-def/Result";

function extract(target: ArraySchema<string>) {
  return target.map((v) => {
    return v;
  });
}

export class GameResultDTO {
  daifugoPlayerList: string[];
  fugoPlayerList: string[];
  heiminPlayerList: string[];
  hinminPlayerList: string[];
  daihinminPlayerList: string[];
  constructor(result: Result) {
    this.daifugoPlayerList = extract(result.daifugoPlayerList);
    this.fugoPlayerList = extract(result.fugoPlayerList);
    this.heiminPlayerList = extract(result.heiminPlayerList);
    this.hinminPlayerList = extract(result.hinminPlayerList);
    this.daihinminPlayerList = extract(result.daihinminPlayerList);
  }
}

export class GameStateDTO {
  playerCount: number;
  playerNameList: string[];
  ownerPlayerName: string;
  isInGame: boolean;
  lastGameResult: GameResultDTO;
  currentGameResult: GameResultDTO;
  constructor(gameState: GameState) {
    this.playerCount = gameState.playerCount;
    this.playerNameList = extract(gameState.playerNameList);
    this.ownerPlayerName = gameState.ownerPlayerName;
    this.isInGame = gameState.isInGame;
    this.lastGameResult = new GameResultDTO(gameState.lastGameResult);
    this.currentGameResult = new GameResultDTO(gameState.currentGameResult);
  }
}
