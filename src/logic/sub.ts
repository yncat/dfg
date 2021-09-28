import { RoomListLogic } from "./roomList";
import { ChatMessageListLogic } from "./chatMessageList";
import { ChatPanelLogic } from "./chatPanel";
import { AutoReadLogic } from "./autoRead";

export interface SubLogicList {
  roomListLogic: RoomListLogic;
  lobbyChatMessageListLogic: ChatMessageListLogic;
  lobbyChatPanelLogic: ChatPanelLogic;
  roomChatMessageListLogic: ChatMessageListLogic;
  roomChatPanelLogic: ChatPanelLogic;
  autoReadLogic: AutoReadLogic;
}
