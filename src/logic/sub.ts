import { RoomListLogic } from "./roomList";
import { ChatMessageListLogic } from "./chatMessageList";
import { ChatPanelLogic } from "./chatPanel";
import { AutoReadLogic } from "./autoRead";
import { CurrentRoomInfoLogic } from "./currentRoomInfo";

export interface SubLogicList {
  roomListLogic: RoomListLogic;
  lobbyChatMessageListLogic: ChatMessageListLogic;
  lobbyChatPanelLogic: ChatPanelLogic;
  roomChatMessageListLogic: ChatMessageListLogic;
  roomChatPanelLogic: ChatPanelLogic;
  autoReadLogic: AutoReadLogic;
  currentRoomInfoLogic: CurrentRoomInfoLogic;
}
