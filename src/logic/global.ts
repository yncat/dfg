import { I18nService } from "../i18n/interface";
import { SoundLogic } from "./sound";

type AutoReadUpdateFunc = (updateString: string) => void;
export interface GlobalLogic {
  i18n: I18nService;
  sound: SoundLogic;
  subscribeConnectionEvent: (
    onConnectionStatusChanged: (
      isConnected: boolean,
      playerCount: number
    ) => void
  ) => void;
  connect: () => void;
  setAutoReadUpdateFunc: (updateFunc: AutoReadUpdateFunc) => void;
  updateAutoRead: (updateString: string) => void;
}

export class GlobalLogicImple implements GlobalLogic {
  onConnectionStatusChanged:
    | null
    | ((isConnected: boolean, playerCount: number) => void);
  i18n: I18nService;
  sound: SoundLogic;
  autoReadUpdateFunc: AutoReadUpdateFunc | null;

  constructor(i18n: I18nService, sound: SoundLogic) {
    this.onConnectionStatusChanged = null;
    this.autoReadUpdateFunc = null;
    this.i18n = i18n;
    this.sound = sound;
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
        this.onConnectionStatusChanged(true, 2);
      }
    }, 1000);
  }

  public setAutoReadUpdateFunc(updateFunc: AutoReadUpdateFunc): void {
    this.autoReadUpdateFunc = updateFunc;
  }

  public updateAutoRead(updateString: string): void {
    if (this.autoReadUpdateFunc) {
      this.autoReadUpdateFunc(updateString);
    }
  }
}

export function createGlobalLogic(
  i18n: I18nService,
  sound: SoundLogic
): GlobalLogic {
  return new GlobalLogicImple(i18n, sound);
}
