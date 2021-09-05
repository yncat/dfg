import * as Colyseus from "colyseus.js";
import { ChatMessage, encodeChatRequest } from "dfg-messages";
export type ChatMessagePipelineFunc = (chatMessage: ChatMessage) => void;
export type ChatMessageListUpdateFunc = (
  chatMessageList: ChatMessage[]
) => void;

export interface ChatMessageListLogic {
  fetchLatest: () => ChatMessage[];
  push: (chatMessage: ChatMessage) => void;
  subscribe: (onUpdate: ChatMessageListUpdateFunc) => void;
  unsubscribe: () => void;
  send: (roomFromGlobalLogic: Colyseus.Room | null, message: string) => void;
}

export class ChatMessageListImple implements ChatMessageListLogic {
  latestEntries: ChatMessage[];
  onUpdate: ChatMessageListUpdateFunc | null;
  constructor() {
    this.latestEntries = [];
    this.onUpdate = null;
  }

  public fetchLatest(): ChatMessage[] {
    // React state must be immutable
    return Array.from(this.latestEntries);
  }

  public push(chatMessage: ChatMessage): void {
    this.latestEntries.push(chatMessage);
    if (this.onUpdate) {
      // React state must be immutable
      this.onUpdate(Array.from(this.latestEntries));
    }
  }

  public subscribe(onUpdate: ChatMessageListUpdateFunc): void {
    this.onUpdate = onUpdate;
  }

  public unsubscribe(): void {
    this.onUpdate = null;
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
