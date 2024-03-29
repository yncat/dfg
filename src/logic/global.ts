import * as Colyseus from "colyseus.js";
import {
  ChatMessage,
  RoomCreatedMessage,
  GameRoomMetadata,
  ChatMessageDecoder,
  RoomCreatedMessageDecoder,
  GameRoomMetadataDecoder,
  decodePayload,
  RuleConfig,
} from "dfg-messages";
import { I18nService } from "../i18n/interface";
import { SoundLogic } from "./sound";
import { ChatMessagePipelineFunc } from "./chatMessageList";
import { createRoomListEntry, RoomListUpdatePipelineFunc } from "./roomList";
import { isDecodeSuccess } from "./decodeValidator";
import { Pubsub } from "./pubsub";
import { Pipeline } from "./pipeline";
import { GlobalState } from "./schema-def/GlobalState";
import { Config } from "./config";
import { protocolVersion } from "./protocolVersion";
import { Reconnection, ReconnectionInfo } from "./reconnection";

const PING_INTERVAL_MS = 2500;

export type ConnectionStatusString =
  | "not_connected"
  | "connecting"
  | "connected";

type RoomRegistrationPipelineFunc = (
  room: Colyseus.Room,
  playerNameMemo: string
) => void;

export interface GlobalLogic {
  i18n: I18nService;
  sound: SoundLogic;
  connectionStatusPubsub: Pubsub<ConnectionStatusString>;
  connectionErrorPubsub: Pubsub<any>;
  playerCountPubsub: Pubsub<number>;
  autoReadPubsub: Pubsub<string>;
  roomCreatedPubsub: Pubsub<string>;
  isInRoomPubsub: Pubsub<boolean>;
  setPlayerName: (playerName: string) => void;
  connect: () => void;
  reconnect: (onFinish: (success: boolean) => void) => Promise<void>;
  startRoomListUpdatePolling: () => void;
  stopRoomListUpdatePolling: () => void;
  requestRoomListUpdate: () => void;
  createGameRoom: (
    ruleConfig: RuleConfig,
    onFinish: (success: boolean) => void
  ) => void;
  joinGameRoomByID: (
    roomID: string,
    onFinish: (success: boolean) => void
  ) => void;
  leaveGameRoom: () => void;
  getRoomInstance: (lobbyOrRoom: "lobby" | "room") => Colyseus.Room | null;
  updateAutoRead: (updateString: string) => void;
  lobbyChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomListUpdatePipeline: Pipeline<RoomListUpdatePipelineFunc>;
  roomRegistrationPipeline: Pipeline<RoomRegistrationPipelineFunc>;
  // TODO: delete after switching to session-based.
  registeredPlayerName: string;
  getAndCacheReconnectionInfo: () => ReconnectionInfo;
  discardReconnectionInfo: () => void;
}

export class GlobalLogicImple implements GlobalLogic {
  connectionStatusPubsub: Pubsub<ConnectionStatusString>;
  connectionErrorPubsub: Pubsub<unknown>;
  playerCountPubsub: Pubsub<number>;
  autoReadPubsub: Pubsub<string>;
  roomCreatedPubsub: Pubsub<string>;
  isInRoomPubsub: Pubsub<boolean>;
  client: Colyseus.Client;
  lobbyRoom: Colyseus.Room | null;
  gameRoom: Colyseus.Room | null;
  i18n: I18nService;
  config: Config;
  sound: SoundLogic;
  reconnection: Reconnection;
  registeredPlayerName: string;
  lobbyChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomListUpdatePipeline: Pipeline<RoomListUpdatePipelineFunc>;
  roomRegistrationPipeline: Pipeline<RoomRegistrationPipelineFunc>;
  private roomListUpdatePollingID: NodeJS.Timer | null;
  private isReconnecting: boolean;
  private cachedReconnectionInfo: ReconnectionInfo;
  private pingIntervalID: number;
  private pingSentTime: number;
  private pingReceivedMs: number;

  constructor(
    i18n: I18nService,
    sound: SoundLogic,
    config: Config,
    reconnection: Reconnection
  ) {
    this.isReconnecting = false;
    this.cachedReconnectionInfo = {
      isReconnectionAvailable: false,
      playerName: "",
      reconnectionToken: "",
    };
    this.reconnection = reconnection;
    this.connectionStatusPubsub = new Pubsub<ConnectionStatusString>();
    this.connectionErrorPubsub = new Pubsub<unknown>();
    this.playerCountPubsub = new Pubsub<number>();
    this.autoReadPubsub = new Pubsub<string>();
    this.roomCreatedPubsub = new Pubsub<string>();
    this.isInRoomPubsub = new Pubsub<boolean>();
    this.config = config;
    const c = new Colyseus.Client(this.config.serverAddress);
    this.client = c;
    this.lobbyRoom = null;
    this.gameRoom = null;
    this.lobbyChatMessagePipeline = new Pipeline<ChatMessagePipelineFunc>();
    this.roomChatMessagePipeline = new Pipeline<ChatMessagePipelineFunc>();
    this.roomListUpdatePipeline = new Pipeline<RoomListUpdatePipelineFunc>();
    this.roomRegistrationPipeline =
      new Pipeline<RoomRegistrationPipelineFunc>();
    this.i18n = i18n;
    this.sound = sound;
    this.registeredPlayerName = "";
    this.roomListUpdatePollingID = null;
    this.pingIntervalID = 0;
    this.pingReceivedMs = -1;
    this.pingSentTime = 0;
  }

  public setPlayerName(playerName: string): void {
    this.registeredPlayerName = playerName;
  }

  public async connect() {
    this.connectionStatusPubsub.publish("connecting");
    try {
      this.lobbyRoom = await this.client.joinOrCreate("global_room", {
        playerName: this.registeredPlayerName,
        protocolVersion: protocolVersion,
      });
    } catch (e) {
      this.connectionStatusPubsub.publish("not_connected");
      this.connectionErrorPubsub.publish(e);
      return;
    }

    this.lobbyRoom?.onError((code, message) => {
      const castedMessage = message === undefined ? "not provided" : message;
      alert(
        `ロビー接続でエラーが発生しました。ページを再読み込みしてください。\nError code: ${code}\nmessage: ${castedMessage}`
      );
    });

    // Set ping from the client side
    this.setupPing();

    // start watching for room list updates
    this.startRoomListUpdatePolling();

    const rm = this.lobbyRoom as Colyseus.Room;

    // Receive pong
    rm.onMessage("PingMessage", (payload) => {
      this.pingReceivedMs = Math.round(performance.now() - this.pingSentTime);
    });

    // Receive chat
    rm.onMessage("ChatMessage", (payload) => {
      const message = decodePayload<ChatMessage>(payload, ChatMessageDecoder);
      if (!isDecodeSuccess<ChatMessage>(message)) {
        return;
      }
      this.lobbyChatMessagePipeline.call(message);
    });

    // Receive room created notification
    rm.onMessage("RoomCreatedMessage", (payload) => {
      const msg = decodePayload<RoomCreatedMessage>(
        payload,
        RoomCreatedMessageDecoder
      );
      if (!isDecodeSuccess<RoomCreatedMessage>(msg)) {
        return;
      }

      this.roomCreatedPubsub.publish(msg.playerName);
      // Immediately request room list update
      this.requestRoomListUpdate();
    });

    // Update number of players connected
    rm.onStateChange((state: GlobalState) => {
      this.playerCountPubsub.publish(state.playerCount);
    });

    this.connectionStatusPubsub.publish("connected");
  }

  private setupPing() {
    this.pingReceivedMs = -1;
    this.pingSentTime = 0;
    this.pingIntervalID = window.setInterval(() => {
      if (this.pingSentTime > 0 && this.pingReceivedMs === -1) {
        alert("サーバーとの接続が切れました。ページを再読み込みしてください。");
        window.clearInterval(this.pingIntervalID);
        return;
      }
      this.pingReceivedMs = -1;
      this.lobbyRoom?.send("PingRequest", "");
      this.pingSentTime = performance.now();
    }, PING_INTERVAL_MS);
  }

  public async reconnect(onFinish: (success: boolean) => void): Promise<void> {
    try {
      await this.connect();
    } catch {
      return;
    }
    try {
      this.gameRoom = await this.client.reconnect(
        this.cachedReconnectionInfo.reconnectionToken
      );
      onFinish(true);
    } catch (e) {
      console.log(e);
      onFinish(false);
      return;
    }
    this.isReconnecting = false;
    this.handleGameRoomJoin();
  }

  private handleGameRoomJoin() {
    this.gameRoom?.onError((code, message) => {
      const castedMessage = message === undefined ? "not provided" : message;
      alert(
        `ルーム接続でエラーが発生しました。ページを再読み込みしてください。\nError code: ${code}\nmessage: ${castedMessage}`
      );
    });

    this.isInRoomPubsub.publish(true);
    // Receive chat
    const grm = this.gameRoom as Colyseus.Room;
    grm.onMessage("ChatMessage", (payload) => {
      const message = decodePayload<ChatMessage>(payload, ChatMessageDecoder);
      if (!isDecodeSuccess<ChatMessage>(message)) {
        return;
      }
      this.roomChatMessagePipeline.call(message);
    });

    // game specific actions are handled by GameLogic.
    // Register the room using the pipeline.
    this.roomRegistrationPipeline.call(grm, this.registeredPlayerName);
  }

  public startRoomListUpdatePolling() {
    if (this.roomListUpdatePollingID) {
      return;
    }

    this.requestRoomListUpdate();
    this.roomListUpdatePollingID = setInterval(() => {
      this.requestRoomListUpdate();
    }, 5000);
  }

  public requestRoomListUpdate() {
    this.client.getAvailableRooms("game_room").then((rooms) => {
      const entries = rooms.map((room) => {
        const md = decodePayload<GameRoomMetadata>(
          room.metadata,
          GameRoomMetadataDecoder
        ) as GameRoomMetadata;
        return createRoomListEntry(
          md.owner,
          room.clients,
          md.roomState,
          md.ruleConfig,
          md.playerNameList,
          room.roomId
        );
      });
      this.roomListUpdatePipeline.call(entries);
    });
  }

  public stopRoomListUpdatePolling() {
    if (this.roomListUpdatePollingID) {
      clearInterval(this.roomListUpdatePollingID);
      this.roomListUpdatePollingID = null;
    }
  }

  public async createGameRoom(
    ruleConfig: RuleConfig,
    onFinish: (success: boolean) => void
  ) {
    try {
      this.gameRoom = await this.client.create("game_room", {
        playerName: this.registeredPlayerName,
        ruleConfig: ruleConfig,
      });
      onFinish(true);
    } catch (e) {
      console.log(e);
      onFinish(false);
    }

    const lrm = this.lobbyRoom as Colyseus.Room;
    lrm.send("RoomCreatedRequest", "");
    this.isInRoomPubsub.publish(true);

    // Receive chat
    const grm = this.gameRoom as Colyseus.Room;
    grm.onMessage("ChatMessage", (payload) => {
      const message = decodePayload<ChatMessage>(payload, ChatMessageDecoder);
      if (!isDecodeSuccess<ChatMessage>(message)) {
        return;
      }
      this.roomChatMessagePipeline.call(message);
    });

    // game specific actions are handled by GameLogic.
    // Register the room using the pipeline.
    this.roomRegistrationPipeline.call(grm, this.registeredPlayerName);
  }

  public async joinGameRoomByID(
    roomID: string,
    onFinish: (success: boolean) => void
  ) {
    try {
      this.gameRoom = await this.client.joinById(roomID, {
        playerName: this.registeredPlayerName,
        protocolVersion: protocolVersion,
      });
      onFinish(true);
    } catch (e) {
      console.log(e);
      onFinish(false);
    }
    this.handleGameRoomJoin();
  }

  public leaveGameRoom() {
    if (!this.gameRoom) {
      return;
    }

    this.gameRoom.leave();
    this.reconnection.endSession();
    this.isInRoomPubsub.publish(false);
  }

  public getRoomInstance(lobbyOrRoom: "lobby" | "room"): Colyseus.Room | null {
    return lobbyOrRoom === "lobby" ? this.lobbyRoom : this.gameRoom;
  }

  public updateAutoRead(updateString: string): void {
    this.autoReadPubsub.publish(updateString);
  }

  public getAndCacheReconnectionInfo(): ReconnectionInfo {
    const ret = this.reconnection.getReconnectionInfo();
    if (ret.isReconnectionAvailable) {
      this.setPlayerName(ret.playerName);
    }
    this.cachedReconnectionInfo = ret;
    return ret;
  }

  public discardReconnectionInfo(): void {
    this.reconnection.endSession();
  }
}

export function createGlobalLogic(
  i18n: I18nService,
  sound: SoundLogic,
  config: Config,
  reconnection: Reconnection
): GlobalLogic {
  return new GlobalLogicImple(i18n, sound, config, reconnection);
}
