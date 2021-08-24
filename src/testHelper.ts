import { createGlobalLogic } from "./logic/global";
import { createI18nService } from "./i18n/i18n";

export function createGlobalLogicForTest(){
	return createGlobalLogic(createI18nService("Japanese"));
}
