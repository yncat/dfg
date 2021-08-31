import { RoomListLogic } from "./roomList";
import { ChatMessageListLogic } from "./chatMessageList";
import { AutoReadLogic } from "./autoRead";
import { CurrentRoomInfoLogic } from "./currentRoomInfo";

export interface SubLogicList{
	roomListLogic:RoomListLogic;
	lobbyChatMessageListLogic:ChatMessageListLogic;
	roomChatMessageListLogic:ChatMessageListLogic;
	autoReadLogic:AutoReadLogic;
	currentRoomInfoLogic:CurrentRoomInfoLogic;
}
