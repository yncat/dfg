import * as Colyseus from "colyseus.js";
import { ChatMessage, encodeChatRequest } from "dfg-messages";
import { Pubsub } from "./pubsub";
export type ChatMessagePipelineFunc = (chatMessage: ChatMessage) => void;
export type ChatMessageSubscriber = (chatMessageList: ChatMessage[]) => void;

export interface ChatMessageListLogic {
  pubsub: Pubsub<ChatMessageSubscriber>;
  fetchLatest: () => ChatMessage[];
  push: (chatMessage: ChatMessage) => void;
  send: (roomFromGlobalLogic: Colyseus.Room | null, message: string) => void;
}

export class ChatMessageListImple implements ChatMessageListLogic {
  latestEntries: ChatMessage[];
  pubsub: Pubsub<ChatMessageSubscriber>;
  constructor() {
    this.latestEntries = [];
    this.pubsub = new Pubsub<ChatMessageSubscriber>();
  }

  public fetchLatest(): ChatMessage[] {
    // React state must be immutable
    return Array.from(this.latestEntries);
  }

  public push(chatMessage: ChatMessage): void {
    this.latestEntries.push(chatMessage);
    // React state must be immutable
    this.pubsub.publish(Array.from(this.latestEntries));
  }

  public send(
    roomFromGlobalLogic: Colyseus.Room | null,
    message: string
  ): void {
    if (roomFromGlobalLogic === null) {
      return;
    }
    if (message === "") {
      return;
    }

    const req = encodeChatRequest(message);
    roomFromGlobalLogic.send("ChatRequest", req);
  }
}

export function createChatMessageListLogic(): ChatMessageListLogic {
  return new ChatMessageListImple();
}
