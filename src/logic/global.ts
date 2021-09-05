import * as Colyseus from "colyseus.js";
import { ChatMessage, ChatMessageDecoder, decodePayload } from "dfg-messages";
import { I18nService } from "../i18n/interface";
import { SoundLogic } from "./sound";
import { ChatMessagePipelineFunc } from "./chatMessageList";
import { isDecodeSuccess } from "./decodeValidator";

export type ConnectionStatusString =
  | "not_connected"
  | "connecting"
  | "connected";

type ConnectionStatusUpdateFunc = (
  connectionStatusString: ConnectionStatusString,
  playerCount: number
) => void;
type ConnectionErrorFunc = (error: unknown) => void;
type PlayerCountUpdateFunc = (playerCount: number) => void;
type AutoReadUpdateFunc = (updateString: string) => void;
export interface GlobalLogic {
  i18n: I18nService;
  sound: SoundLogic;
  subscribeConnectionEvent: (
    onConnectionStatusChanged: ConnectionStatusUpdateFunc,
    onPlayerCountUpdated: PlayerCountUpdateFunc,
    onConnectionError: ConnectionErrorFunc
  ) => void;
  connect: (authInfo: string) => void;
  getRoomInstance: (lobbyOrRoom: "lobby" | "room") => Colyseus.Room | null;
  setAutoReadUpdateFunc: (updateFunc: AutoReadUpdateFunc) => void;
  updateAutoRead: (updateString: string) => void;
  setChatMessagePipelineFuncs: (
    lobby: ChatMessagePipelineFunc,
    room: ChatMessagePipelineFunc
  ) => void;
}

export class GlobalLogicImple implements GlobalLogic {
  client: Colyseus.Client;
  lobbyRoom: Colyseus.Room | null;
  gameRoom: Colyseus.Room | null;
  onPlayerCountUpdated: PlayerCountUpdateFunc | null;
  onConnectionStatusChanged: ConnectionStatusUpdateFunc | null;
  onConnectionError: ConnectionErrorFunc | null;
  i18n: I18nService;
  sound: SoundLogic;
  autoReadUpdateFunc: AutoReadUpdateFunc | null;
  lobbyChatMessagePipelineFunc: ChatMessagePipelineFunc | null;
  roomChatMessagePipelineFunc: ChatMessagePipelineFunc | null;

  constructor(i18n: I18nService, sound: SoundLogic) {
    const c = new Colyseus.Client("ws://localhost:2567");
    this.client = c;
    this.lobbyRoom = null;
    this.gameRoom = null;
    this.onPlayerCountUpdated = null;
    this.onConnectionStatusChanged = null;
    this.onConnectionError = null;
    this.autoReadUpdateFunc = null;
    this.lobbyChatMessagePipelineFunc = null;
    this.roomChatMessagePipelineFunc = null;
    this.i18n = i18n;
    this.sound = sound;
  }

  public subscribeConnectionEvent(
    onConnectionStatusChanged: ConnectionStatusUpdateFunc,
    onPlayerCountUpdated: PlayerCountUpdateFunc,
    onConnectionError: ConnectionErrorFunc
  ) {
    this.onConnectionStatusChanged = onConnectionStatusChanged;
    this.onPlayerCountUpdated = onPlayerCountUpdated;
    this.onConnectionError = onConnectionError;
  }

  public async connect(authInfo: string) {
    this.updateConnectionStatus("connecting", 0);
    try {
      this.lobbyRoom = await this.client.joinOrCreate("global_room", {
        playerName: authInfo,
      });
    } catch (e) {
      this.updateConnectionStatus("not_connected", 0);
      if (this.onConnectionError) {
        this.onConnectionError(e);
      }
    }

    const rm = this.lobbyRoom as Colyseus.Room;
    rm.onMessage("ChatMessage", (payload) => {
      const message = decodePayload<ChatMessage>(payload, ChatMessageDecoder);
      if (!isDecodeSuccess<ChatMessage>(message)) {
        return;
      }
      if (this.lobbyChatMessagePipelineFunc) {
        this.lobbyChatMessagePipelineFunc(message);
      }
    });
    rm.onStateChange((state) => {
      if (this.onPlayerCountUpdated) {
        this.onPlayerCountUpdated(state.playerCount);
      }
    });
    this.updateConnectionStatus("connected", 0);
  }

  public getRoomInstance(lobbyOrRoom: "lobby" | "room"): Colyseus.Room | null {
    return lobbyOrRoom === "lobby" ? this.lobbyRoom : this.gameRoom;
  }

  public setAutoReadUpdateFunc(updateFunc: AutoReadUpdateFunc): void {
    this.autoReadUpdateFunc = updateFunc;
  }

  public updateAutoRead(updateString: string): void {
    if (this.autoReadUpdateFunc) {
      this.autoReadUpdateFunc(updateString);
    }
  }

  public setChatMessagePipelineFuncs(
    lobby: ChatMessagePipelineFunc,
    room: ChatMessagePipelineFunc
  ): void {
    this.lobbyChatMessagePipelineFunc = lobby;
    this.roomChatMessagePipelineFunc = room;
  }

  private updateConnectionStatus(
    connectionStatusString: ConnectionStatusString,
    playerCount: number
  ) {
    if (this.onConnectionStatusChanged) {
      this.onConnectionStatusChanged(connectionStatusString, playerCount);
    }
  }
}

export function createGlobalLogic(
  i18n: I18nService,
  sound: SoundLogic
): GlobalLogic {
  return new GlobalLogicImple(i18n, sound);
}
