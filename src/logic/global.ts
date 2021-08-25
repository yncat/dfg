import { I18nService } from "../i18n/i18n";

export interface GlobalLogic {
  i18n: I18nService;
  subscribeConnectionEvent: (
    onConnectionStatusChanged: (isConnected: boolean,playerCount:number) => void
  ) => void;
  connect: () => void;
}

export class GlobalLogicImple implements GlobalLogic {
  onConnectionStatusChanged:
    | null
    | ((isConnected: boolean, playerCount: number) => void);
  i18n: I18nService;

  constructor(i18n: I18nService) {
    this.onConnectionStatusChanged = null;
    this.i18n = i18n;
  }

  public subscribeConnectionEvent(
    onConnectionStatusChanged: (
      isConnected: boolean,
      playerCount: number
    ) => void
  ) {
    this.onConnectionStatusChanged = onConnectionStatusChanged;
  }

  public connect() {
    setTimeout(() => {
      if (this.onConnectionStatusChanged) {
        this.onConnectionStatusChanged(true,2);
      }
    }, 5000);
  }
}

export function createGlobalLogic(i18n: I18nService): GlobalLogic {
  return new GlobalLogicImple(i18n);
}
