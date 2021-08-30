import { I18nService } from "./interface";
import { JapaneseI18nService } from "./japanese";

export type LanguageCode = "Japanese";

export function createI18nService(languageCode: LanguageCode): I18nService {
  switch (languageCode) {
    case "Japanese":
      return new JapaneseI18nService();
  }
}
