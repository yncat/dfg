import { send } from "process";
import { ChatI18n } from "./interfaces";

export class ChatJapanese implements ChatI18n {
  public chatHeading(): string {
    return "チャット";
  }

  public lobby(): string {
    return "ロビー";
  }

  public room(): string {
    return "ルーム";
  }

  public inputLabel(lobbyOrRoom: "lobby" | "room"): string {
    return lobbyOrRoom === "lobby"
      ? "ロビーへのメッセージ"
      : "ルームへのメッセージ";
  }

  public send(): string {
    return "送信";
  }
}
