import { ConnectionStatusJapanese } from "./connectionStatus";
import { ConnectionStatusI18n } from "./interfaces";

export type LanguageCode = "Japanese";

export interface I18nService {
  connectionStatus: ConnectionStatusI18n;
}

export function createI18nService(languageCode: LanguageCode): I18nService {
  switch (languageCode) {
    case "Japanese":
      return { connectionStatus: new ConnectionStatusJapanese() };
  }
}
