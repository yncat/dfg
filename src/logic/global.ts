import * as Colyseus from "colyseus.js";
import { ChatMessage, ChatMessageDecoder, decodePayload } from "dfg-messages";
import { I18nService } from "../i18n/interface";
import { SoundLogic } from "./sound";
import { ChatMessagePipelineFunc } from "./chatMessageList";
import { isDecodeSuccess } from "./decodeValidator";
import { Pubsub } from "./pubsub";

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
export interface GlobalLogic {
  i18n: I18nService;
  sound: SoundLogic;
  connectionStatusPubsub: Pubsub<ConnectionStatusSubscriber>;
  connectionErrorPubsub: Pubsub<ConnectionErrorSubscriber>;
  playerCountPubsub: Pubsub<PlayerCountSubscriber>;
  autoReadPubsub: Pubsub<AutoReadSubscriber>;
  connect: (authInfo: string) => void;
  getRoomInstance: (lobbyOrRoom: "lobby" | "room") => Colyseus.Room | null;
  updateAutoRead: (updateString: string) => void;
  setChatMessagePipelineFuncs: (
    lobby: ChatMessagePipelineFunc,
    room: ChatMessagePipelineFunc
  ) => void;
}

export class GlobalLogicImple implements GlobalLogic {
  connectionStatusPubsub: Pubsub<ConnectionStatusSubscriber>;
  connectionErrorPubsub: Pubsub<ConnectionErrorSubscriber>;
  playerCountPubsub: Pubsub<PlayerCountSubscriber>;
  autoReadPubsub: Pubsub<AutoReadSubscriber>;
  client: Colyseus.Client;
  lobbyRoom: Colyseus.Room | null;
  gameRoom: Colyseus.Room | null;
  i18n: I18nService;
  sound: SoundLogic;
  lobbyChatMessagePipelineFunc: ChatMessagePipelineFunc | null;
  roomChatMessagePipelineFunc: ChatMessagePipelineFunc | null;

  constructor(i18n: I18nService, sound: SoundLogic) {
    this.connectionStatusPubsub = new Pubsub<ConnectionStatusSubscriber>();
    this.connectionErrorPubsub = new Pubsub<ConnectionErrorSubscriber>();
    this.playerCountPubsub = new Pubsub<PlayerCountSubscriber>();
    this.autoReadPubsub = new Pubsub<AutoReadSubscriber>();
    const c = new Colyseus.Client("ws://localhost:2567");
    this.client = c;
    this.lobbyRoom = null;
    this.gameRoom = null;
    this.lobbyChatMessagePipelineFunc = null;
    this.roomChatMessagePipelineFunc = null;
    this.i18n = i18n;
    this.sound = sound;
  }

  public async connect(authInfo: string) {
    this.connectionStatusPubsub.publish("connecting");
    try {
      this.lobbyRoom = await this.client.joinOrCreate("global_room", {
        playerName: authInfo,
      });
    } catch (e) {
      this.connectionStatusPubsub.publish("not_connected");
      this.connectionErrorPubsub.publish(e);
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
      this.playerCountPubsub.publish(state.playerCount);
    });
    this.connectionStatusPubsub.publish("connected");
  }

  public getRoomInstance(lobbyOrRoom: "lobby" | "room"): Colyseus.Room | null {
    return lobbyOrRoom === "lobby" ? this.lobbyRoom : this.gameRoom;
  }

  public updateAutoRead(updateString: string): void {
    this.autoReadPubsub.publish(updateString);
  }

  public setChatMessagePipelineFuncs(
    lobby: ChatMessagePipelineFunc,
    room: ChatMessagePipelineFunc
  ): void {
    this.lobbyChatMessagePipelineFunc = lobby;
    this.roomChatMessagePipelineFunc = room;
  }
}

export function createGlobalLogic(
  i18n: I18nService,
  sound: SoundLogic
): GlobalLogic {
  return new GlobalLogicImple(i18n, sound);
}
