import { I18nService } from "./interface";
import { RankType } from "dfg-messages";

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

  public leaveRoomButton_leaveRoom(): string {
    return "ルームを退室";
  }

  public currentRoom_roomName(playerName: string): string {
    return playerName + "さんのルーム";
  }

  public currentRoom_playerCount(playerCount: number): string {
    return "(" + playerCount + "人)";
  }

  public currentRoom_memberListLabel(): string {
    return "メンバー: ";
  }

  public currentRoom_memberList(playerList: string[]): string {
    return playerList.join("、");
  }

  public currentRoom_currentStatusLabel(): string {
    return "現在の状況: ";
  }

  public currentRoom_currentStatusWaiting(playerName: string): string {
    return playerName + "さんがゲームを開始するまで待機しています。";
  }

  public currentRoom_previousResultHeader(): string {
    return "前回の結果: ";
  }

  public currentRoom_previousResult(
    daifugoPlayerList: string[],
    fugoPlayerList: string[],
    heiminPlayerList: string[],
    hinminPlayerList: string[],
    daihinminPlayerList: string[]
  ): string {
    const ret: string[] = [];
    if (daifugoPlayerList.length > 0) {
      ret.push(
        daifugoPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.DAIFUGO) +
          "。"
      );
    }
    if (fugoPlayerList.length > 0) {
      ret.push(
        fugoPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.FUGO) +
          "。"
      );
    }
    if (heiminPlayerList.length > 0) {
      ret.push(
        heiminPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.HEIMIN) +
          "。"
      );
    }
    if (hinminPlayerList.length > 0) {
      ret.push(
        hinminPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.HINMIN) +
          "。"
      );
    }
    if (daihinminPlayerList.length > 0) {
      ret.push(
        daihinminPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.DAIHINMIN) +
          "。"
      );
    }

    return ret.join("");
  }

  public game_rankType(rankType: RankType): string {
    switch (rankType) {
      case RankType.DAIFUGO as number:
        return "大富豪";
      case RankType.FUGO:
        return "富豪";
      case RankType.HEIMIN:
        return "平民";
      case RankType.HINMIN:
        return "貧民";
      case RankType.DAIHINMIN:
        return "大貧民";
    }
    return ""; // never executed
  }
}
