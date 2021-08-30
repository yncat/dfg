import { I18nService } from "./interfaces";

export class JapaneseI18nService implements I18nService {
  public connectionStatus_mainServer(): string {
    return "メインサーバー";
  }

  public connectionStatus_notConnected(): string {
    return "未接続";
  }

  public connectionStatus_connecting(): string {
    return "接続中...";
  }

  public connectionStatus_connected(playerCount: number): string {
    return "接続済み(現在オンライン: " + playerCount + ")";
  }

  public chat_chatHeading(): string {
    return "チャット";
  }

  public chat_lobby(): string {
    return "ロビー";
  }

  public chat_room(): string {
    return "ルーム";
  }

  public chat_inputLabel(lobbyOrRoom: "lobby" | "room"): string {
    return lobbyOrRoom === "lobby"
      ? "ロビーへのメッセージ"
      : "ルームへのメッセージ";
  }

  public chat_send(): string {
    return "送信";
  }

  public createRoomButton_createRoom(): string {
    return "ルームを作成";
  }

  public roomList_creator(): string {
    return "作成者";
  }

  public roomList_currentPlayerCount(): string {
    return "現在の人数";
  }

  public roomList_join(): string {
    return "参加";
  }
}
