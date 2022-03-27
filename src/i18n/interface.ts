import { RankType, RoomState, CardMark, CardMessage } from "dfg-messages";

export interface Result {
  daifugoPlayerList: string[];
  fugoPlayerList: string[];
  heiminPlayerList: string[];
  hinminPlayerList: string[];
  daihinminPlayerList: string[];
}

export interface I18nService {
  login_as: (playerName: string) => string;
  login_connecting: () => string;
  login_connected: () => string;
  login_cannotConnect: () => string;
  login_serverOffline: () => string;
  connectionStatus_mainServer: () => string;
  connectionStatus_notConnected: () => string;
  connectionStatus_connecting: () => string;
  connectionStatus_connected: (playerCount: number) => string;
  chat_chatHeading: () => string;
  chat_lobby: () => string;
  chat_room: () => string;
  chat_inputLabel: (lobbyOrLabel: "lobby" | "room") => string;
  chat_send: () => string;
  createRoomButton_createRoom: () => string;
  roomList_creator: () => string;
  roomList_currentPlayerCount: () => string;
  roomList_state: () => string;
  roomList_action: () => string;
  roomList_join: () => string;
  roomList_watch: () => string;
  roomList_stateValue: (state: RoomState) => string;
  leaveRoomButton_leaveRoom: () => string;
  currentRoom_roomName: (playerName: string) => string;
  currentRoom_playerCount: (playerCount: number) => string;
  currentRoom_memberListLabel: () => string;
  currentRoom_memberList: (playerList: string[]) => string;
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
  cardSelector_heading: () => string;
  game_rankType: (rankType: RankType) => string;
  game_cardMark: (cardMark: CardMark) => string;
  game_card: (cardMark: CardMark, cardNumber: number) => string;
  game_cardList: (cardList: CardMessage[]) => string;
  game_playerJoined: (name: string) => string;
  game_playerLeft: (name: string) => string;
  game_initialInfo: (playerCount: number, deckCount: number) => string;
  game_cardsProvided: (playerName: string, cardCount: number) => string;
  game_yourTurn: () => string;
  game_turn: (playerName: string) => string;
  settings_heading: () => string;
  settings_soundToggle: () => string;
  settings_musicToggle: () => string;
  lobbyAnnouncement_roomCreated: (playerCount: string) => string;
}
