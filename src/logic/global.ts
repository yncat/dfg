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

export type ConnectionStatusString =
  | "not_connected"
  | "connecting"
  | "connected";

type RoomRegistrationPipelineFunc = (room: Colyseus.Room) => void;

export interface GlobalLogic {
  i18n: I18nService;
  sound: SoundLogic;
  connectionStatusPubsub: Pubsub<ConnectionStatusString>;
  connectionErrorPubsub: Pubsub<any>;
  playerCountPubsub: Pubsub<number>;
  autoReadPubsub: Pubsub<string>;
  roomCreatedPubsub: Pubsub<string>;
  isInRoomPubsub: Pubsub<boolean>;
  connect: () => void;
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
  registeredPlayerName: string;
  lobbyChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomListUpdatePipeline: Pipeline<RoomListUpdatePipelineFunc>;
  roomRegistrationPipeline: Pipeline<RoomRegistrationPipelineFunc>;
  private roomListUpdatePollingID: NodeJS.Timer | null;

  constructor(i18n: I18nService, sound: SoundLogic, config: Config) {
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
    }

    this.lobbyRoom?.onError((code, message) => {
      const castedMessage = message === undefined ? "not provided" : message;
      alert(
        `ロビー接続でエラーが発生しました。このあと、ゲームが正常に動作しない可能性があります。\nError code: ${code}\nmessage: ${castedMessage}`
      );
    });

    // start watching for room list updates
    this.startRoomListUpdatePolling();

    const rm = this.lobbyRoom as Colyseus.Room;
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
        const md2 = decodePayload<GameRoomMetadata>(
          room.metadata,
          GameRoomMetadataDecoder
        );
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
    this.roomRegistrationPipeline.call(grm);
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

    this.gameRoom?.onError((code, message) => {
      const castedMessage = message === undefined ? "not provided" : message;
      alert(
        `ルーム接続でエラーが発生しました。このあと、ゲームが正常に動作しない可能性があります。\nError code: ${code}\nmessage: ${castedMessage}`
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
    this.roomRegistrationPipeline.call(grm);
  }

  public leaveGameRoom() {
    if (!this.gameRoom) {
      return;
    }

    this.gameRoom.leave();
    this.isInRoomPubsub.publish(false);
  }

  public getRoomInstance(lobbyOrRoom: "lobby" | "room"): Colyseus.Room | null {
    return lobbyOrRoom === "lobby" ? this.lobbyRoom : this.gameRoom;
  }

  public updateAutoRead(updateString: string): void {
    this.autoReadPubsub.publish(updateString);
  }
}

export function createGlobalLogic(
  i18n: I18nService,
  sound: SoundLogic,
  config: Config
): GlobalLogic {
  return new GlobalLogicImple(i18n, sound, config);
}
