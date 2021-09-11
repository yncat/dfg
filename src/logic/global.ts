import * as Colyseus from "colyseus.js";
import {
  ChatMessage,
  RoomCreatedMessage,
  GameRoomMetadata,
  ChatMessageDecoder,
  RoomCreatedMessageDecoder,
  GameRoomMetadataDecoder,
  decodePayload,
} from "dfg-messages";
import { I18nService } from "../i18n/interface";
import { SoundLogic } from "./sound";
import { ChatMessagePipelineFunc } from "./chatMessageList";
import { createRoomListEntry, RoomListUpdatePipelineFunc } from "./roomList";
import { isDecodeSuccess } from "./decodeValidator";
import { Pubsub } from "./pubsub";
import { Pipeline } from "./pipeline";

export type ConnectionStatusString =
  | "not_connected"
  | "connecting"
  | "connected";

type ConnectionStatusSubscriber = (
  connectionStatusString: ConnectionStatusString
) => void;
type ConnectionErrorSubscriber = (error: unknown) => void;
type PlayerCountSubscriber = (playerCount: number) => void;
type AutoReadSubscriber = (updateString: string) => void;
type RoomCreatedSubscriber = (playerName: string) => void;
export interface GlobalLogic {
  i18n: I18nService;
  sound: SoundLogic;
  connectionStatusPubsub: Pubsub<ConnectionStatusSubscriber>;
  connectionErrorPubsub: Pubsub<ConnectionErrorSubscriber>;
  playerCountPubsub: Pubsub<PlayerCountSubscriber>;
  autoReadPubsub: Pubsub<AutoReadSubscriber>;
  roomCreatedPubsub: Pubsub<RoomCreatedSubscriber>;
  connect: () => void;
  startRoomListUpdatePolling: () => void;
  stopRoomListUpdatePolling: () => void;
  requestRoomListUpdate: () => void;
  createGameRoom: () => void;
  getRoomInstance: (lobbyOrRoom: "lobby" | "room") => Colyseus.Room | null;
  updateAutoRead: (updateString: string) => void;
  lobbyChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomListUpdatePipeline: Pipeline<RoomListUpdatePipelineFunc>;
  // TODO: delete after switching to session-based.
  registeredPlayerName: string;
}

export class GlobalLogicImple implements GlobalLogic {
  connectionStatusPubsub: Pubsub<ConnectionStatusSubscriber>;
  connectionErrorPubsub: Pubsub<ConnectionErrorSubscriber>;
  playerCountPubsub: Pubsub<PlayerCountSubscriber>;
  autoReadPubsub: Pubsub<AutoReadSubscriber>;
  roomCreatedPubsub: Pubsub<RoomCreatedSubscriber>;
  client: Colyseus.Client;
  lobbyRoom: Colyseus.Room | null;
  gameRoom: Colyseus.Room | null;
  i18n: I18nService;
  sound: SoundLogic;
  registeredPlayerName: string;
  lobbyChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomChatMessagePipeline: Pipeline<ChatMessagePipelineFunc>;
  roomListUpdatePipeline: Pipeline<RoomListUpdatePipelineFunc>;
  private roomListUpdatePollingID: NodeJS.Timer | null;

  constructor(i18n: I18nService, sound: SoundLogic) {
    this.connectionStatusPubsub = new Pubsub<ConnectionStatusSubscriber>();
    this.connectionErrorPubsub = new Pubsub<ConnectionErrorSubscriber>();
    this.playerCountPubsub = new Pubsub<PlayerCountSubscriber>();
    this.autoReadPubsub = new Pubsub<AutoReadSubscriber>();
    this.roomCreatedPubsub = new Pubsub<RoomCreatedSubscriber>();
    const c = new Colyseus.Client("ws://localhost:2567");
    this.client = c;
    this.lobbyRoom = null;
    this.gameRoom = null;
    this.lobbyChatMessagePipeline = new Pipeline<ChatMessagePipelineFunc>();
    this.roomChatMessagePipeline = new Pipeline<ChatMessagePipelineFunc>();
    this.roomListUpdatePipeline = new Pipeline<RoomListUpdatePipelineFunc>();
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
      });
    } catch (e) {
      this.connectionStatusPubsub.publish("not_connected");
      this.connectionErrorPubsub.publish(e);
    }

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
    });

    // Update number of players connected
    rm.onStateChange((state) => {
      this.playerCountPubsub.publish(state.playerCount);
    });

    this.connectionStatusPubsub.publish("connected");
  }

  public startRoomListUpdatePolling() {
    if (this.roomListUpdatePollingID) {
      return;
    }

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
        return createRoomListEntry(md.owner, room.clients, room.roomId);
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

  public async createGameRoom() {
    try {
      this.gameRoom = await this.client.create("game_room", {
        playerName: this.registeredPlayerName,
      });
    } catch (e) {
      console.log(e);
    }

    const rm = this.lobbyRoom as Colyseus.Room;
    rm.send("RoomCreatedRequest", "");
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
  sound: SoundLogic
): GlobalLogic {
  return new GlobalLogicImple(i18n, sound);
}
