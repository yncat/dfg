import { createGlobalLogic } from "./logic/global";
import { createRoomListLogic } from "./logic/roomList";
import { createChatMessageListLogic } from "./logic/chatMessageList";
import { createAutoReadLogic } from "./logic/autoRead";
import { createI18nService } from "./i18n/i18n";
import { SubLogicList } from "./logic/sub";

export function createGlobalLogicForTest(){
	return createGlobalLogic(createI18nService("Japanese"));
}

export function createSubLogicListForTest():SubLogicList{
	return {
		roomListLogic: createRoomListLogic(),
		lobbyChatMessageListLogic:createChatMessageListLogic(),
		roomChatMessageListLogic:createChatMessageListLogic(),
		autoReadLogic: createAutoReadLogic(),
	};
}