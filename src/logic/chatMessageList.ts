import { ChatMessage } from "dfg-messages";
import { Pubsub } from "./pubsub";
export type ChatMessagePipelineFunc = (chatMessage: ChatMessage) => void;
export type ChatMessageSubscriber = (chatMessageList: ChatMessage[]) => void;

export interface ChatMessageListLogic {
  pubsub: Pubsub<ChatMessageSubscriber>;
  fetchLatest: () => ChatMessage[];
  push: (chatMessage: ChatMessage) => void;
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
}

export function createChatMessageListLogic(): ChatMessageListLogic {
  return new ChatMessageListImple();
}
