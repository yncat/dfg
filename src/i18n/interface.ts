import {
  RankType,
  RoomState,
  CardMark,
  CardMessage,
  DiscardPairMessage,
  RuleConfig,
  WebSocketErrorCode,
  WaitReason,
} from "dfg-messages";

export interface Result {
  daifugoPlayerList: string[];
  fugoPlayerList: string[];
  heiminPlayerList: string[];
  hinminPlayerList: string[];
  daihinminPlayerList: string[];
}

export interface I18nService {
  html_lang: () => string;
  login_as: (playerName: string) => string;
  login_needName: () => string;
  login_connecting: () => string;
  login_connected: () => string;
  login_cannotConnect: () => string;
  login_serverOffline: () => string;
  connectionStatus_mainServer: () => string;
  connectionStatus_notConnected: () => string;
  connectionStatus_connecting: () => string;
  connectionStatus_connected: (playerCount: number) => string;
  playerNameList: (playerNameList: string[]) => string;
  chat_chatHeading: () => string;
  chat_lobby: () => string;
  chat_room: () => string;
  chat_inputLabel: (lobbyOrLabel: "lobby" | "room") => string;
  chat_send: () => string;
  createRoomButton_createRoom: () => string;
  createRoomButton_creating: () => string;
  roomSettings_title: () => string;
  roomSettings_create: () => string;
  roomSettings_cancel: () => string;
  roomSettings_ruleSettingsHeading: () => string;
  roomSettings_yagiri: () => string;
  roomSettings_jBack: () => string;
  roomSettings_kakumei: () => string;
  roomSettings_reverse: () => string;
  roomSettings_skip: () => string;
  roomSettings_skip_off: () => string;
  roomSettings_skip_single: () => string;
  roomSettings_skip_multiple: () => string;
  roomList_creator: () => string;
  roomList_playerNameList: () => string;
  roomList_state: () => string;
  roomList_ruleConfig: () => string;
  roomList_action: () => string;
  roomList_join: () => string;
  roomList_watch: () => string;
  roomList_joining: () => string;
  roomList_stateValue: (state: RoomState) => string;
  roomList_noRoom: () => string;
  ruleConfig: (config: RuleConfig) => string;
  leaveRoomButton_leaveRoom: () => string;
  leaveRoomButton_cancel: () => string;
  leaveRoomButton_confirmLeaving: () => string;
  currentRoom_roomName: (playerName: string) => string;
  currentRoom_playerCount: (playerCount: number) => string;
  currentRoom_ruleConfigLabel: () => string;
  currentRoom_memberListLabel: () => string;
  currentRoom_currentStatusLabel: () => string;
  currentRoom_currentStatusWaiting: (
    playerName: string,
    isOwner: boolean
  ) => string;
  currentRoom_currentStatusPlaying: () => string;
  currentRoom_lastResultHeader: () => string;
  currentRoom_result: (result: Result) => string;
  currentRoom_startGame: () => string;
  currentRoom_cannotStartGame: () => string;
  currentRoom_leave: () => string;
  currentRoom_left: () => string;
  cardSelector_heading: () => string;
  game_rankType: (rankType: RankType) => string;
  game_cardMark: (cardMark: CardMark) => string;
  game_card: (cardMark: CardMark, cardNumber: number) => string;
  game_cardList: (cardList: CardMessage[]) => string;
  game_playerJoined: (name: string) => string;
  game_playerLeft: (name: string) => string;
  game_pass: () => string;
  game_passMessage: (playerName: string, remainingHandCount: number) => string;
  game_initialInfo: (playerCount: number, deckCount: number) => string;
  game_cardsProvided: (playerName: string, cardCount: number) => string;
  game_yourTurn: () => string;
  game_turn: (playerName: string) => string;
  game_discard: (
    playerName: string,
    discardPair: DiscardPairMessage,
    remainingHandCount: number
  ) => string;
  game_nagare: () => string;
  game_strengthInverted: (inverted: boolean) => string;
  game_kakumei: () => string;
  game_reversed: () => string;
  game_skipped: (playerName: string) => string;
  game_ranked: (playerName: string, rankType: RankType) => string;
  game_rankChanged: (
    playerName: string,
    before: RankType,
    after: RankType
  ) => string;
  game_agari: (playerName: string) => string;
  game_forbiddenAgari: (playerName: string) => string;
  game_playerLost: (playerName: string) => string;
  game_playerReconnected: (playerName: string) => string;
  game_playerWait: (playerName: string, reason: WaitReason) => string;
  playingInfo_heading: () => string;
  playingInfo_log: () => string;
  playingInfo_discardStack: () => string;
  playingInfo_removedCardList: () => string;
  gameLog_increase: () => string;
  gameLog_decrease: () => string;
  gameLog_changedRowsCount: (rowsCount: number) => string;
  discardStack_noCards: () => string;
  removedCardEntry: (
    mark: CardMark,
    cardNumber: number,
    count: number
  ) => string;
  removedCards_description: () => string;
  reconnection_explanation: () => string;
  reconnection_reconnectAs: (playerName: string) => string;
  reconnection_discard: () => string;
  settings_heading: () => string;
  settings_soundToggle: () => string;
  settings_musicToggle: () => string;
  lobbyAnnouncement_roomCreated: (playerCount: string) => string;
  exit_confirmation: () => string;
  error_ws: (code: WebSocketErrorCode) => string;
}
