import { RoomListI18n } from "./interfaces";

export class RoomListJapanese implements RoomListI18n {
  public creator(): string {
    return "作成者";
  }

  public currentPlayerCount(): string {
    return "現在の人数";
  }

  public join(): string {
    return "参加";
  }
}
