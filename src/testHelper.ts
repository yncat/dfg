import { Config } from "./logic/config";
import { createGlobalLogic } from "./logic/global";
import { createRoomListLogic } from "./logic/roomList";
import { createChatMessageListLogic } from "./logic/chatMessageList";
import { createChatPanelLogic } from "./logic/chatPanel";
import { createAutoReadLogic } from "./logic/autoRead";
import { createGameLogic } from "./logic/game";
import { createI18nService } from "./i18n/i18n";
import { SoundLogic } from "./logic/sound";
import { Reconnection } from "./logic/reconnection";
import { SubLogicList } from "./logic/sub";
import { mock } from "jest-mock-extended";

export function createGlobalLogicForTest() {
  const rmock = mock<Reconnection>();
  rmock.getReconnectionInfo.mockReturnValue({
    isReconnectionAvailable: false,
    playerName: "",
    reconnectionToken: "",
  });
  return createGlobalLogic(
    createI18nService("Japanese"),
    mock<SoundLogic>(),
    new Config(undefined),
    rmock
  );
}

export function createSubLogicListForTest(): SubLogicList {
  return {
    roomListLogic: createRoomListLogic(),
    lobbyChatMessageListLogic: createChatMessageListLogic(),
    lobbyChatPanelLogic: createChatPanelLogic(),
    roomChatMessageListLogic: createChatMessageListLogic(),
    roomChatPanelLogic: createChatPanelLogic(),
    autoReadLogic: createAutoReadLogic(),
    gameLogic: createGameLogic(createI18nService("Japanese")),
  };
}

export function createClickEvent(): MouseEvent {
  return new MouseEvent("click", { bubbles: true, cancelable: true });
}
