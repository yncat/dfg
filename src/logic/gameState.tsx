import { ArraySchema } from "@colyseus/schema";
import { GameState } from "./schema-def/GameState";
import { Result } from "./schema-def/Result";
import { CardMark, RuleConfig, SkipConfig } from "dfg-messages";

function extract(target: ArraySchema<string>) {
  return target.map((v) => {
    return v;
  });
}

export type EventLogDTO = {
  eventType: string;
  eventBody: string;
  skipEffects: boolean;
};

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

export class CardDTO {
  mark: CardMark;
  cardNumber: number;
  constructor(mark: CardMark, cardNumber: number) {
    this.mark = mark;
    this.cardNumber = cardNumber;
  }
}

export class DiscardPairDTO {
  cards: CardDTO[];
  constructor(...cards: CardDTO[]) {
    this.cards = cards;
  }
}

export class RemovedCardEntryDTO {
  mark: CardMark;
  cardNumber: number;
  count: number;
  constructor(mark: CardMark, cardNumber: number, count: number) {
    this.mark = mark;
    this.cardNumber = cardNumber;
    this.count = count;
  }
}

export class GameStateDTO {
  playerCount: number;
  playerNameList: string[];
  ownerPlayerName: string;
  isInGame: boolean;
  lastGameResult: GameResultDTO;
  currentGameResult: GameResultDTO;
  discardStack: DiscardPairDTO[];
  removedCardList: RemovedCardEntryDTO[];
  ruleConfig: RuleConfig;
  constructor(gameState: GameState) {
    this.playerCount = gameState.playerCount;
    this.playerNameList = extract(gameState.playerNameList);
    this.ownerPlayerName = gameState.ownerPlayerName;
    this.isInGame = gameState.isInGame;
    this.lastGameResult = new GameResultDTO(gameState.lastGameResult);
    this.currentGameResult = new GameResultDTO(gameState.currentGameResult);
    const dps = gameState.discardStack.map((v) => {
      const cards = v.cards.map((w) => {
        return new CardDTO(w.mark as CardMark, w.cardNumber);
      });
      return new DiscardPairDTO(...cards);
    });
    this.discardStack = dps;
    this.removedCardList = gameState.removedCardList.map((v) => {
      return new RemovedCardEntryDTO(v.mark as CardMark, v.cardNumber, v.count);
    });
    this.ruleConfig = {
      yagiri: gameState.ruleConfig.yagiri,
      jBack: gameState.ruleConfig.jBack,
      kakumei: gameState.ruleConfig.kakumei,
      reverse: gameState.ruleConfig.reverse,
      skip: gameState.ruleConfig.skip as SkipConfig,
      transfer: gameState.ruleConfig.transfer,
      exile: gameState.ruleConfig.exile,
    };
  }
}
