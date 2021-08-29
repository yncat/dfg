import { RoomListLogic } from "./roomList";
import { ChatMessageListLogic } from "./chatMessageList";

export interface SubLogicList{
	roomListLogic:RoomListLogic;
	lobbyChatMessageListLogic:ChatMessageListLogic;
	roomChatMessageListLogic:ChatMessageListLogic;
}
