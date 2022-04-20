import * as Colyseus from "colyseus.js";
import * as dfgmsg from "dfg-messages";
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
  cardListUpdated: Pubsub<dfgmsg.CardListMessage>;
  discardPairListUpdated: Pubsub<dfgmsg.DiscardPairListMessage>;
}

type InitialInfoFunc = (playerCount: number, deckCount: number) => void;
type CardsProvidedFunc = (playerName: string, cardCount: number) => void;
type YourTurnFunc = () => void;
type TurnFunc = (playerName: string) => void;

export interface Pipelines {
  initialInfo: Pipeline<InitialInfoFunc>;
  cardsProvided: Pipeline<CardsProvidedFunc>;
  yourTurn: Pipeline<YourTurnFunc>;
  turn: Pipeline<TurnFunc>;
}

export interface GameLogic {
  pubsubs: Pubsubs;
  pipelines: Pipelines;
  registerRoom: (room: Colyseus.Room) => void;
  unregisterRoom: () => void;
  startGame: () => void;
  selectCard: (index: number) => void;
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
      cardListUpdated: new Pubsub<dfgmsg.CardListMessage>(),
      discardPairListUpdated: new Pubsub<dfgmsg.DiscardPairListMessage>(),
    };
    this.pipelines = {
      initialInfo: new Pipeline<InitialInfoFunc>(),
      cardsProvided: new Pipeline<CardsProvidedFunc>(),
      yourTurn: new Pipeline<YourTurnFunc>(),
      turn: new Pipeline<TurnFunc>(),
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
      const msg = dfgmsg.decodePayload<dfgmsg.PlayerJoinedMessage>(
        payload,
        dfgmsg.PlayerJoinedMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.PlayerJoinedMessage>(msg)) {
        return;
      }
      this.pubsubs.playerJoined.publish(msg.playerName);
    });

    room.onMessage("PlayerLeftMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.PlayerLeftMessage>(
        payload,
        dfgmsg.PlayerLeftMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.PlayerLeftMessage>(msg)) {
        return;
      }
      this.pubsubs.playerLeft.publish(msg.playerName);
    });

    room.onMessage("InitialInfoMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.InitialInfoMessage>(
        payload,
        dfgmsg.InitialInfoMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.InitialInfoMessage>(msg)) {
        return;
      }
      this.pipelines.initialInfo.call(msg.playerCount, msg.deckCount);
    });

    room.onMessage("CardsProvidedMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.CardsProvidedMessage>(
        payload,
        dfgmsg.CardsProvidedMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.CardsProvidedMessage>(msg)) {
        return;
      }
      this.pipelines.cardsProvided.call(msg.playerName, msg.cardCount);
    });

    room.onMessage("YourTurnMessage", (payload: any) => {
      this.pipelines.yourTurn.call();
    });

    room.onMessage("TurnMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.TurnMessage>(
        payload,
        dfgmsg.TurnMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.TurnMessage>(msg)) {
        return;
      }
      this.pipelines.turn.call(msg.playerName);
    });

    room.onMessage("CardListMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.CardListMessage>(
        payload,
        dfgmsg.CardListMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.CardListMessage>(msg)) {
        return;
      }
      this.pubsubs.cardListUpdated.publish(msg);
    });

    room.onMessage("DiscardPairListMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.DiscardPairListMessage>(
        payload,
        dfgmsg.DiscardPairListMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.DiscardPairListMessage>(msg)) {
        return;
      }
      this.pubsubs.discardPairListUpdated.publish(msg);
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

  public selectCard(index: number): void {
    if (!this.room) {
      return;
    }
    this.room.send("CardSelectRequest", dfgmsg.encodeCardSelectRequest(index));
  }
}

export function createGameLogic(): GameLogic {
  return new GameLogicImple();
}
