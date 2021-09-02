import { RankType, CardMark } from "dfg-messages";

export interface I18nService {
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
  roomList_join: () => string;
  leaveRoomButton_leaveRoom: () => string;
  currentRoom_roomName: (playerName: string) => string;
  currentRoom_playerCount: (playerCount: number) => string;
  currentRoom_memberListLabel: () => string;
  currentRoom_memberList: (playerList: string[]) => string;
  currentRoom_currentStatusLabel: () => string;
  currentRoom_currentStatusWaiting: (playerName: string) => string;
  currentRoom_lastResultHeader: () => string;
  currentRoom_result: (
    daifugoPlayerList: string[],
    fugoPlayerList: string[],
    heiminPlayerList: string[],
    hinminPlayerList: string[],
    daihinminPlayerList: string[]
  ) => string;
  cardSelector_heading:()=>string;
  game_rankType: (rankType: RankType) => string;
  game_cardMark: (cardMark: CardMark) => string;
  game_card: (cardMark: CardMark, cardNumber: number) => string;
}
