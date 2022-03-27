import * as Colyseus from "colyseus.js";
import {
  PlayerJoinedMessage,
  PlayerJoinedMessageDecoder,
  PlayerLeftMessage,
  PlayerLeftMessageDecoder,
  InitialInfoMessage,
  InitialInfoMessageDecoder,
  CardsProvidedMessage,
  CardsProvidedMessageDecoder,
  decodePayload,
} from "dfg-messages";
import { GameState } from "./schema-def/GameState";
import { GameStateDTO } from "./gameState";
import { Pubsub } from "./pubsub";
import { Pipeline } from "./pipeline";
import { isDecodeSuccess } from "./decodeValidator";

export interface Pubsubs {
  stateUpdate: Pubsub<GameStateDTO>;
  gameOwnerStatus: Pubsub<boolean>;
  playerJoined: Pubsub<string>;
  playerLeft: Pubsub<string>;
}

type InitialInfoFunc = (playerCount: number, deckCount: number) => void;
type CardsProvidedFunc = (playerName: string, cardCount: number) => void;

export interface Pipelines {
  initialInfo: Pipeline<InitialInfoFunc>;
  cardsProvided: Pipeline<CardsProvidedFunc>;
}

export interface GameLogic {
  pubsubs: Pubsubs;
  pipelines: Pipelines;
  registerRoom: (room: Colyseus.Room) => void;
  unregisterRoom: () => void;
  startGame: () => void;
}

class GameLogicImple implements GameLogic {
  pubsubs: Pubsubs;
  pipelines: Pipelines;
  private room: Colyseus.Room | null;
  constructor() {
    this.room = null;
    this.pubsubs = {
      stateUpdate: new Pubsub<GameStateDTO>(),
      gameOwnerStatus: new Pubsub<boolean>(),
      playerJoined: new Pubsub<string>(),
      playerLeft: new Pubsub<string>(),
    };
    this.pipelines = {
      initialInfo: new Pipeline<InitialInfoFunc>(),
      cardsProvided: new Pipeline<CardsProvidedFunc>(),
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

    room.onMessage("PlayerLeftMessage", (payload: any) => {
      const msg = decodePayload<PlayerLeftMessage>(
        payload,
        PlayerLeftMessageDecoder
      );
      if (!isDecodeSuccess<PlayerLeftMessage>(msg)) {
        return;
      }
      this.pubsubs.playerLeft.publish(msg.playerName);
    });

    room.onMessage("InitialInfoMessage", (payload: any) => {
      const msg = decodePayload<InitialInfoMessage>(
        payload,
        InitialInfoMessageDecoder
      );
      if (!isDecodeSuccess<InitialInfoMessage>(msg)) {
        return;
      }
      this.pipelines.initialInfo.call(msg.playerCount, msg.deckCount);
    });

    room.onMessage("CardsProvidedMessage", (payload: any) => {
      const msg = decodePayload<CardsProvidedMessage>(
        payload,
        CardsProvidedMessageDecoder
      );
      if (!isDecodeSuccess<CardsProvidedMessage>(msg)) {
        return;
      }
      this.pipelines.cardsProvided.call(msg.playerName, msg.cardCount);
    });

    this.room = room;
  }

  public unregisterRoom(): void {
    this.room = null;
  }

  public startGame(): void {
    if (!this.room) {
      return;
    }
    this.room.send("GameStartRequest", "");
  }
}

export function createGameLogic(): GameLogic {
  return new GameLogicImple();
}
