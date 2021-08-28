import { createGlobalLogic } from "./logic/global";
import { createRoomListLogic } from "./logic/roomList";
import { createI18nService } from "./i18n/i18n";
import { SubLogicList } from "./logic/sub";

export function createGlobalLogicForTest(){
	return createGlobalLogic(createI18nService("Japanese"));
}

export function createSubLogicListForTest():SubLogicList{
	return {roomListLogic: createRoomListLogic()};
}