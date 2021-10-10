import { ChatMessage } from "dfg-messages";
import { Pubsub } from "./pubsub";
export type ChatMessagePipelineFunc = (chatMessage: ChatMessage) => void;

export interface ChatMessageListLogic {
  pubsub: Pubsub<ChatMessage[]>;
  fetchLatest: () => ChatMessage[];
  push: (chatMessage: ChatMessage) => void;
}

export class ChatMessageListImple implements ChatMessageListLogic {
  pubsub: Pubsub<ChatMessage[]>;
  constructor() {
    this.pubsub = new Pubsub<ChatMessage[]>();
  }

  public fetchLatest(): ChatMessage[] {
    const latest = this.pubsub.fetchLatest();
    // React state must be immutable
    return Array.from(latest === null ? [] : latest);
  }

  public push(chatMessage: ChatMessage): void {
    const latest = this.fetchLatest();
    latest.push(chatMessage);
    // React state must be immutable
    this.pubsub.publish(Array.from(latest));
  }
}

export function createChatMessageListLogic(): ChatMessageListLogic {
  return new ChatMessageListImple();
}
