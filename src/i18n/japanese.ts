import { Result, I18nService } from "./interface";
import {
  RankType,
  RoomState,
  CardMark,
  CardMessage,
  DiscardPairMessage,
} from "dfg-messages";

export class JapaneseI18nService implements I18nService {
  public login_as(playerName: string): string {
    return playerName + "としてログイン";
  }

  public login_connecting(): string {
    return "接続中...";
  }

  public login_connected(): string {
    return "接続しました!";
  }

  public login_cannotConnect(): string {
    return "サーバーに接続できませんでした。\n";
  }

  public login_serverOffline(): string {
    return "現在サーバーが稼働していないようです。しばらくしてからもう一度アクセスしてみてください。";
  }

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

  public roomList_action(): string {
    return "アクション";
  }

  public roomList_state(): string {
    return "状態";
  }

  public roomList_join(): string {
    return "参加";
  }

  public roomList_watch(): string {
    return "観戦";
  }

  public roomList_stateValue(state: RoomState): string {
    return state === RoomState.PLAYING ? "ゲーム中" : "待機中";
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

  public currentRoom_currentStatusWaiting(
    playerName: string,
    isOwnerYourself: boolean
  ): string {
    return isOwnerYourself
      ? "プレイヤーが集まったら、「ゲーム開始」ボタンを押してゲームを始めてください。"
      : playerName + "さんがゲームを開始するまで待機しています。";
  }

  public currentRoom_currentStatusPlaying(): string {
    return "プレイ中";
  }

  public currentRoom_lastResultHeader(): string {
    return "前回の結果: ";
  }

  public currentRoom_result(result: Result): string {
    const ret: string[] = [];
    if (result.daifugoPlayerList.length > 0) {
      ret.push(
        result.daifugoPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.DAIFUGO) +
          "。"
      );
    }
    if (result.fugoPlayerList.length > 0) {
      ret.push(
        result.fugoPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.FUGO) +
          "。"
      );
    }
    if (result.heiminPlayerList.length > 0) {
      ret.push(
        result.heiminPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.HEIMIN) +
          "。"
      );
    }
    if (result.hinminPlayerList.length > 0) {
      ret.push(
        result.hinminPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.HINMIN) +
          "。"
      );
    }
    if (result.daihinminPlayerList.length > 0) {
      ret.push(
        result.daihinminPlayerList.join("、") +
          "が" +
          this.game_rankType(RankType.DAIHINMIN) +
          "。"
      );
    }

    if (ret.length === 0) {
      return "結果なし。";
    }

    return ret.join("");
  }

  public currentRoom_startGame(): string {
    return "ゲーム開始";
  }

  public currentRoom_cannotStartGame(): string {
    return "一人ではゲームを開始できません";
  }

  public currentRoom_leave(): string {
    return "ルームを退室";
  }

  public currentRoom_left(): string {
    return "ルームから退室しました。";
  }

  public cardSelector_heading(): string {
    return "自分の手札";
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

  public game_cardMark(cardMark: CardMark): string {
    switch (cardMark) {
      case CardMark.CLUBS:
        return "クラブ";
      case CardMark.DIAMONDS:
        return "ダイヤ";
      case CardMark.HEARTS:
        return "ハート";
      case CardMark.SPADES:
        return "スペード";
      case CardMark.JOKER:
      case CardMark.WILD:
        return "ジョーカー";
    }
    return "";
  }

  public game_card(cardMark: CardMark, cardNumber: number): string {
    if (cardMark === CardMark.JOKER) {
      return this.game_cardMark(cardMark);
    }
    return this.game_cardMark(cardMark) + "の" + cardNumber;
  }

  public game_cardList(cardList: CardMessage[]): string {
    const cds = cardList.map((v) => {
      return this.game_card(v.mark, v.cardNumber);
    });
    return cds.length === 1
      ? cds[0]
      : cds.join("、") + "の" + cds.length + "枚";
  }

  public game_playerJoined(name: string): string {
    return name + "が入室しました。";
  }

  public game_playerLeft(name: string): string {
    return name + "が退室しました。";
  }

  public game_pass() {
    return "パス";
  }

  public game_passMessage(playerName: string): string {
    return playerName + "はパス。";
  }

  public game_initialInfo(playerCount: number, deckCount: number): string {
    return (
      "" +
      playerCount +
      "人でゲームを始めます。" +
      deckCount +
      "セットのデッキを使用します。"
    );
  }

  public game_cardsProvided(playerName: string, cardCount: number): string {
    return "" + playerName + "に、" + cardCount + "枚のカードが配られました。";
  }

  public game_yourTurn(): string {
    return "アクションを選択してください。";
  }

  public game_turn(playerName: string): string {
    return "" + playerName + "のターン。";
  }

  public game_discard(
    playerName: string,
    discardPair: DiscardPairMessage,
    remainingHandCount: number
  ): string {
    return (
      playerName +
      "は、" +
      this.game_cardList(discardPair.cardList) +
      "をプレイ、残り" +
      remainingHandCount +
      "枚。"
    );
  }

  public game_nagare() {
    return "場のカードが流れました。";
  }

  public game_strengthInverted(inverted: boolean): string {
    return inverted
      ? "カードの強さが逆になりました。"
      : "カードの強さが元に戻りました。";
  }

  public game_kakumei(): string {
    return "革命！";
  }

  public game_ranked(playerName: string, rankType: RankType): string {
    return (
      playerName + "は、" + this.game_rankType(rankType) + "になりました！"
    );
  }

  public game_rankChanged(
    playerName: string,
    before: RankType,
    after: RankType
  ): string {
    return (
      playerName +
      "は、" +
      this.game_rankType(before) +
      "から" +
      this.game_rankType(after) +
      "になりました！"
    );
  }

  public gameLog_heading(): string {
    return "最新のログ";
  }

  public settings_heading(): string {
    return "環境設定";
  }

  public settings_soundToggle(): string {
    return "効果音を鳴らす";
  }

  public settings_musicToggle(): string {
    return "音楽を鳴らす";
  }

  public lobbyAnnouncement_roomCreated(playerName: string): string {
    return playerName + "さんが、新しいルームを作成しました。";
  }
}
