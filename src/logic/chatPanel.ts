import * as Colyseus from "colyseus.js";
import { ChatMessage, encodeChatRequest } from "dfg-messages";
export type ChatMessagePipelineFunc = (chatMessage: ChatMessage) => void;
export type ChatMessageSubscriber = (chatMessageList: ChatMessage[]) => void;

export interface ChatPanelLogic {
  send: (roomFromGlobalLogic: Colyseus.Room | null, message: string) => void;
}

export class ChatPanelLogicImple implements ChatPanelLogic {
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

export function createChatPanelLogic(): ChatPanelLogic {
  return new ChatPanelLogicImple();
}
