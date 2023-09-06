import * as Colyseus from "colyseus.js";
import * as dfgmsg from "dfg-messages";
import { GameState } from "./schema-def/GameState";
import { GameStateDTO } from "./gameState";
import { EventProcessor, ProcessedEvent } from "./event";
import { Pubsub } from "./pubsub";
import { Pipeline } from "./pipeline";
import { isDecodeSuccess } from "./decodeValidator";
import { createReconnection } from "./reconnection";
import { I18nService } from "../i18n/interface";

export type NotifiedEvent = {
  event: ProcessedEvent;
  shouldSkipEffects: boolean;
};

export interface Pubsubs {
  stateUpdate: Pubsub<GameStateDTO>;
  eventLogUpdate: Pubsub<NotifiedEvent>;
  gameOwnerStatus: Pubsub<boolean>;
  playerJoined: Pubsub<string>;
  playerLeft: Pubsub<string>;
  cardListUpdated: Pubsub<dfgmsg.CardListMessage>;
  discardPairListUpdated: Pubsub<dfgmsg.DiscardPairListMessage>;
}

type YourTurnFunc = (
  context: dfgmsg.YourTurnContext,
  passable: boolean
) => void;
type LostFunc = (playerName: string) => void;
type ReconnectedFunc = (playerName: string) => void;
type WaitFunc = (playerName: string, reason: dfgmsg.WaitReason) => void;

export interface Pipelines {
  yourTurn: Pipeline<YourTurnFunc>;
  lost: Pipeline<LostFunc>;
  reconnected: Pipeline<ReconnectedFunc>;
  wait: Pipeline<WaitFunc>;
}

export interface GameLogic {
  pubsubs: Pubsubs;
  pipelines: Pipelines;
  registerRoom: (room: Colyseus.Room, playerNameMemo: string) => void;
  unregisterRoom: () => void;
  startGame: () => void;
  selectCard: (index: number) => void;
  discard: (index: number) => void;
  pass: () => void;
}

class GameLogicImple implements GameLogic {
  pubsubs: Pubsubs;
  pipelines: Pipelines;
  private room: Colyseus.Room | null;
  private playerNameMemo: string;
  private eventLogLengthMemo: number;
  private firstSynced: boolean;
  private eventProcessor: EventProcessor;
  constructor(i18n: I18nService) {
    this.room = null;
    this.playerNameMemo = "";
    this.eventLogLengthMemo = 0;
    this.firstSynced = false;
    this.eventProcessor = new EventProcessor(i18n);
    this.pubsubs = {
      stateUpdate: new Pubsub<GameStateDTO>(),
      eventLogUpdate: new Pubsub<NotifiedEvent>(),
      gameOwnerStatus: new Pubsub<boolean>(),
      playerJoined: new Pubsub<string>(),
      playerLeft: new Pubsub<string>(),
      cardListUpdated: new Pubsub<dfgmsg.CardListMessage>(),
      discardPairListUpdated: new Pubsub<dfgmsg.DiscardPairListMessage>(),
    };
    this.pipelines = {
      yourTurn: new Pipeline<YourTurnFunc>(),
      lost: new Pipeline<LostFunc>(),
      reconnected: new Pipeline<ReconnectedFunc>(),
      wait: new Pipeline<WaitFunc>(),
    };
  }

  public registerRoom(room: Colyseus.Room, playerNameMemo: string): void {
    this.playerNameMemo = playerNameMemo;
    this.eventLogLengthMemo = 0;
    this.firstSynced = false;
    room.onStateChange((state: GameState) => {
      // 昔はstateをそのまま使っていた。が、どうやら colyseus はインスタンスの再生成をしないらしいので、 react でうまく後進を拾ってくれなかった。
      // そのへんのライフサイクルをいい感じにコントロールできるように、毎回DTOに詰め替える。
      this.pubsubs.stateUpdate.publish(new GameStateDTO(state));
      // イベントログの処理
      // colyseus がもともと持っている onAdd という便利コールバックがあるが、これはあえて使っていない。
      // イベントログが追加されたら音や音声を出すが、途中から観戦に入った場合、それまでのログはエフェクトを出さず、ログバッファに貯めるようにしたい
      // stateの初期同期かどうかを判定するロジックを自前で入れている
      if (!this.firstSynced) {
        this.syncFirstEventLogs(state);
      } else {
        this.syncEventLogs(state);
      }
      this.firstSynced = true;
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

    room.onMessage("PreventCloseMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.PreventCloseMessage>(
        payload,
        dfgmsg.PreventCloseMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.PreventCloseMessage>(msg)) {
        return;
      }
      if (this.room) {
        if (msg.preventClose) {
          createReconnection().startSession(
            this.playerNameMemo,
            this.room.reconnectionToken
          );
        } else {
          createReconnection().endSession();
        }
      }
    });

    room.onMessage("YourTurnMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.YourTurnMessage>(
        payload,
        dfgmsg.YourTurnMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.YourTurnMessage>(msg)) {
        return;
      }

      this.pipelines.yourTurn.call(msg.context, msg.passable);
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

    room.onMessage("PlayerLostMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.PlayerLostMessage>(
        payload,
        dfgmsg.PlayerLostMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.PlayerLostMessage>(msg)) {
        return;
      }
      this.pipelines.lost.call(msg.playerName);
    });

    room.onMessage("PlayerReconnectedMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.PlayerReconnectedMessage>(
        payload,
        dfgmsg.PlayerReconnectedMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.PlayerReconnectedMessage>(msg)) {
        return;
      }
      this.pipelines.reconnected.call(msg.playerName);
    });

    room.onMessage("PlayerWaitMessage", (payload: any) => {
      const msg = dfgmsg.decodePayload<dfgmsg.PlayerWaitMessage>(
        payload,
        dfgmsg.PlayerWaitMessageDecoder
      );
      if (!isDecodeSuccess<dfgmsg.PlayerWaitMessage>(msg)) {
        return;
      }
      this.pipelines.wait.call(msg.playerName, msg.reason);
    });

    this.room = room;
  }

  public unregisterRoom(): void {
    this.room = null;
    this.pubsubs.gameOwnerStatus.publish(false);
    this.pubsubs.playerJoined.clearLatest();
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

  public discard(index: number): void {
    if (!this.room) {
      return;
    }
    this.room.send("DiscardRequest", dfgmsg.encodeDiscardRequest(index));
  }

  public pass(): void {
    if (!this.room) {
      return;
    }
    this.room.send("PassRequest", "");
  }

  private syncFirstEventLogs(state: GameState) {
    // stateの初期同期時は、効果音と読み上げを鳴らさないため、 skipEffects = true で pubsub に送る
    state.eventLogList.forEach((item) => {
      const pevt = this.eventProcessor.processEvent(item.type, item.body);
      this.pubsubs.eventLogUpdate.publish({
        event: pevt,
        shouldSkipEffects: true,
      });
    });
    this.eventLogLengthMemo = state.eventLogList.length;
  }

  private syncEventLogs(state: GameState) {
    if (state.eventLogList.length === this.eventLogLengthMemo) {
      return;
    }
    for (let i = this.eventLogLengthMemo; i < state.eventLogList.length; i++) {
      const item = state.eventLogList[i];
      const pevt = this.eventProcessor.processEvent(item.type, item.body);
      this.pubsubs.eventLogUpdate.publish({
        event: pevt,
        shouldSkipEffects: false,
      });
    }
    this.eventLogLengthMemo = state.eventLogList.length;
  }
}

export function createGameLogic(i18n: I18nService): GameLogic {
  return new GameLogicImple(i18n);
}
