import { createGlobalLogic } from "./logic/global";
import { createRoomListLogic } from "./logic/roomList";
import { createChatMessageListLogic } from "./logic/chatMessageList";
import { createAutoReadLogic } from "./logic/autoRead";
import { createCurrentRoomInfoLogic } from "./logic/currentRoomInfo";
import { createI18nService } from "./i18n/i18n";
import { SoundLogic } from "./logic/sound";
import { SubLogicList } from "./logic/sub";
import { mock } from "jest-mock-extended";

export function createGlobalLogicForTest() {
  return createGlobalLogic(createI18nService("Japanese"), mock<SoundLogic>());
}

export function createSubLogicListForTest(): SubLogicList {
  return {
    roomListLogic: createRoomListLogic(),
    lobbyChatMessageListLogic: createChatMessageListLogic(),
    roomChatMessageListLogic: createChatMessageListLogic(),
    autoReadLogic: createAutoReadLogic(),
    currentRoomInfoLogic: createCurrentRoomInfoLogic(),
  };
}
