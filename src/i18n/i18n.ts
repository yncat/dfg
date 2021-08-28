import { ConnectionStatusJapanese } from "./connectionStatus";
import { CreateRoomButtonJapanese } from "./createRoomButton";
import { RoomListJapanese } from "./roomList";
import {
  ConnectionStatusI18n,
  CreateRoomButtonI18n,
  RoomListI18n,
} from "./interfaces";

export type LanguageCode = "Japanese";

export interface I18nService {
  connectionStatus: ConnectionStatusI18n;
  createRoomButton: CreateRoomButtonI18n;
  roomList: RoomListI18n;
}

export function createI18nService(languageCode: LanguageCode): I18nService {
  switch (languageCode) {
    case "Japanese":
      return {
        connectionStatus: new ConnectionStatusJapanese(),
        createRoomButton: new CreateRoomButtonJapanese(),
        roomList: new RoomListJapanese(),
      };
  }
}
