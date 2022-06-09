import { Result, I18nService } from "./interface";
import {
  RankType,
  RoomState,
  CardMark,
  CardMessage,
  DiscardPairMessage,
  RuleConfig,
  SkipConfig,
  WebSocketErrorCode,
} from "dfg-messages";

export class JapaneseI18nService implements I18nService {
  public html_lang(): string {
    return "ja";
  }

  public login_as(playerName: string): string {
    return playerName + "としてログイン";
  }

  public login_needName(): string {
    return "接続するには、名前を入力してください";
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

  public createRoomButton_creating(): string {
    return "作成中...";
  }

  public roomSettings_title(): string {
    return "ルームの設定";
  }

  public roomSettings_create(): string {
    return "作成";
  }

  public roomSettings_cancel(): string {
    return "キャンセル";
  }

  public roomSettings_ruleSettingsHeading(): string {
    return "ルール設定";
  }

  public roomSettings_yagiri(): string {
    return "8で場のカードを流す(8切り)";
  }

  public roomSettings_jBack(): string {
    return "11でカードの強さを逆にする(11バック、Jバック)";
  }

  public roomSettings_kakumei(): string {
    return "4枚同時だしで、返されるまでカードの強さを逆にする(革命/革命返し)";
  }

  public roomSettings_reverse(): string {
    return "9でターンの順番を逆にする(9リバース)";
  }

  public roomSettings_skip(): string {
    return "5で次のプレイヤーの順番を飛ばす(5飛ばし、5スキップ)";
  }

  public roomSettings_skip_off(): string {
    return "飛ばさない";
  }

  public roomSettings_skip_single(): string {
    return "次のプレイヤーを飛ばす(シングルスキップ)";
  }

  public roomSettings_skip_multiple(): string {
    return "出した枚数分のプレイヤーを飛ばす(マルチスキップ)";
  }

  public roomList_creator(): string {
    return "作成者";
  }

  public roomList_currentPlayerCount(): string {
    return "現在の人数";
  }

  public roomList_ruleConfig(): string {
    return "ルール設定";
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

  public roomList_joining(): string {
    return "参加中...";
  }

  public roomList_stateValue(state: RoomState): string {
    return state === RoomState.PLAYING ? "ゲーム中" : "待機中";
  }

  public roomList_noRoom(): string {
    return "現在、利用可能なルームはありません。";
  }

  public ruleConfig(config: RuleConfig): string {
    const ret: String[] = [];
    if (config.yagiri) {
      ret.push("8切り");
    }
    if (config.jBack) {
      ret.push("11バック");
    }
    if (config.kakumei) {
      ret.push("革命");
    }
    if (config.reverse) {
      ret.push("9リバース");
    }
    if (config.skip === SkipConfig.SINGLE) {
      ret.push("シングルスキップ");
    }
    if (config.skip === SkipConfig.MULTI) {
      ret.push("マルチスキップ");
    }
    return ret.join("、");
  }

  public leaveRoomButton_leaveRoom(): string {
    return "ルームを退室";
  }

  public leaveRoomButton_cancel(): string {
    return "ルームに残る";
  }

  public leaveRoomButton_confirmLeaving(): string {
    return "本当にルームを退室しますか？";
  }

  public currentRoom_roomName(playerName: string): string {
    return playerName + "さんのルーム";
  }

  public currentRoom_playerCount(playerCount: number): string {
    return "(" + playerCount + "人)";
  }

  public currentRoom_ruleConfigLabel(): string {
    return "ルール設定: ";
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

  public game_passMessage(
    playerName: string,
    remainingHandCount: number
  ): string {
    return playerName + "はパス、残り" + remainingHandCount + "枚。";
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

  public game_reversed(): string {
    return "ターンの回り方が逆になりました。";
  }

  public game_skipped(playerName: string): string {
    return `${playerName}のターンが飛ばされました。`;
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

  public game_agari(playerName: string): string {
    return playerName + "は上がり！";
  }

  public game_forbiddenAgari(playerName: string): string {
    return playerName + "は禁止上がり！";
  }

  public playingInfo_heading(): string {
    return "ゲームの状況";
  }

  public playingInfo_log(): string {
    return "ゲームログ";
  }

  public playingInfo_discardStack(): string {
    return "場のカード";
  }

  public playingInfo_removedCardList(): string {
    return "未使用のカード";
  }

  public gameLog_increase(): string {
    return "表示を増やす";
  }

  public discardStack_noCards(): string {
    return "場に出ているカードはありません。";
  }

  public gameLog_decrease(): string {
    return "表示を減らす";
  }

  public gameLog_changedRowsCount(rowsCount: number): string {
    return `${rowsCount}件`;
  }

  public removedCardEntry(
    mark: CardMark,
    cardNumber: number,
    count: number
  ): string {
    return `${this.game_card(mark, cardNumber)}が${count}枚`;
  }

  public removedCards_description(): string {
    return "途中でゲームから抜けたプレイヤーのカードは、このゲーム中では使用されなくなり、ここに表示されます。";
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

  public exit_confirmation(): string {
    return "このまま終了すると、ルームから抜けてしまいますがよろしいですか？";
  }

  public error_ws(code: WebSocketErrorCode): string {
    switch (code) {
      case WebSocketErrorCode.PROTOCOL_VERSION_MISMATCH:
        return "クライアントのバージョンが古いです。ブラウザを再読み込みしてから、もう一度接続してください。それでも解決しない場合は、ブラウザのキャッシュを削除してからお試しください。";
      case WebSocketErrorCode.INVALID_PLAYER_NAME:
        return "プレイヤー名が入力されなかったか、使用できない文字を含んでいたため、サーバーによって接続が拒否されました。スペースのみ、または、句読点を含む名前は使用できません。";
      default:
        return "原因不明のエラーです。";
    }
  }
}
