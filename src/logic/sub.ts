import { RoomListLogic } from "./roomList";
import { ChatMessageListLogic } from "./chatMessageList";
import { AutoReadLogic } from "./autoRead";

export interface SubLogicList{
	roomListLogic:RoomListLogic;
	lobbyChatMessageListLogic:ChatMessageListLogic;
	roomChatMessageListLogic:ChatMessageListLogic;
	autoReadLogic:AutoReadLogic;
}
