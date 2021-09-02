export interface ChatMessageEntry {
  playerName: string;
  message: string;
}

export interface ChatMessageListLogic {
  fetchLatest: () => ChatMessageEntry[];
}

export class ChatMessageListImple implements ChatMessageListLogic {
  public fetchLatest(): ChatMessageEntry[] {
    return [
      { playerName: "cat", message: "test1" },
      { playerName: "dog", message: "test2" },
    ];
  }
}

export function createChatMessageListLogic(): ChatMessageListLogic {
  return new ChatMessageListImple();
}
