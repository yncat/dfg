import { Howl, Howler } from "howler";
import { textSpanIntersectsWithTextSpan } from "typescript";
export const SoundEvent = {
  CLICK: 0,
  CHAT: 1,
} as const;
export type SoundEvent = typeof SoundEvent[keyof typeof SoundEvent];

export interface SoundLogic {
  initIfNeeded: () => void;
  enqueueEvent: (soundEvent: SoundEvent) => void;
  toggleOutput: (output: boolean) => void;
}

interface SoundEventDefinition {
  soundWithoutExt: string;
  waitTime: number;
}

const soundEventDefinitionMap: Map<SoundEvent, SoundEventDefinition> = new Map<
  SoundEvent,
  SoundEventDefinition
>([
  [SoundEvent.CLICK, { soundWithoutExt: "click", waitTime: 0 }],
  [SoundEvent.CHAT, { soundWithoutExt: "chat", waitTime: 0 }],
]);

export class SoundLogicImple implements SoundLogic {
  output: boolean;
  howlMap: Map<string, Howl>;
  eventQueue: SoundEvent[];
  constructor() {
    this.output = true;
    this.howlMap = new Map<string, Howl>();
    this.eventQueue = [];
  }

  public initIfNeeded(): void {
    this.load(["click", "chat"]);
  }

  public enqueueEvent(soundEvent: SoundEvent): void {
    this.eventQueue.push(soundEvent);
    if (this.eventQueue.length === 1) {
      this.handleEventQueue();
    }
  }

  public toggleOutput(output: boolean): void {
    this.output = output;
  }

  private load(soundWithoutExtList: string[]) {
    const basePath = process.env.PUBLIC_URL + "/";
    soundWithoutExtList.forEach((soundWithoutExt) => {
      const webmPath = basePath + soundWithoutExt + ".webm";
      const mp3Path = basePath + soundWithoutExt + ".mp3";
      this.howlMap.set(
        soundWithoutExt,
        new Howl({ src: [webmPath, mp3Path], preload: true })
      );
    });
  }

  private handleEventQueue() {
    const evt = this.eventQueue.shift();
    if (!evt) {
      return;
    }
    const def = soundEventDefinitionMap.get(evt);
    if (!def) {
      return;
    }

    const howl = this.howlMap.get(def.soundWithoutExt);
    if (!howl) {
      return;
    }
    howl.play();

    if (this.eventQueue.length === 0) {
      return;
    }

    if (def.waitTime === 0) {
      this.handleEventQueue();
    }

    setTimeout(this.handleEventQueue.bind(this), def.waitTime);
  }
}
