import { Howl } from "howler";

export const SoundEvent = {
  CLICK: 0,
  CHAT: 1,
  CONNECTED: 2,
  ROOMCREATED: 3,
  JOINED: 4,
  LEFT: 5,
  START: 6,
  TURN: 7,
  SHUFFLE: 8,
  GIVE: 9,
  DISCARD: 10,
  RESET: 11,
  PASS: 12,
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SoundEvent = typeof SoundEvent[keyof typeof SoundEvent];

export interface SoundLogic {
  initIfNeeded: () => void;
  enqueueEvent: (soundEvent: SoundEvent) => void;
  toggleSoundOutput: (output: boolean) => void;
  toggleMusicOutput: (output: boolean) => void;
  startMusic: () => void;
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
  [SoundEvent.CONNECTED, { soundWithoutExt: "connected", waitTime: 0 }],
  [SoundEvent.ROOMCREATED, { soundWithoutExt: "newroom", waitTime: 600 }],
  [SoundEvent.JOINED, { soundWithoutExt: "join", waitTime: 600 }],
  [SoundEvent.LEFT, { soundWithoutExt: "leave", waitTime: 600 }],
  [SoundEvent.START, { soundWithoutExt: "start", waitTime: 700 }],
  [SoundEvent.TURN, { soundWithoutExt: "turn", waitTime: 0 }],
  [SoundEvent.SHUFFLE, { soundWithoutExt: "shuffle", waitTime: 700 }],
  [SoundEvent.GIVE, { soundWithoutExt: "give", waitTime: 2500 }],
  [SoundEvent.DISCARD, { soundWithoutExt: "discard", waitTime: 300 }],
  [SoundEvent.RESET, { soundWithoutExt: "reset", waitTime: 1000 }],
  [SoundEvent.PASS, { soundWithoutExt: "pass", waitTime: 300 }],
]);

export class SoundLogicImple implements SoundLogic {
  soundOutput: boolean;
  musicOutput: boolean;
  howlMap: Map<string, Howl>;
  eventQueue: SoundEvent[];
  constructor() {
    this.soundOutput = true;
    this.musicOutput = false;
    this.howlMap = new Map<string, Howl>();
    this.eventQueue = [];
  }

  public initIfNeeded(): void {
    const soundsToLoad = new Set<string>();
    soundEventDefinitionMap.forEach((v) => {
      soundsToLoad.add(v.soundWithoutExt);
    });
    this.load(Array.from(soundsToLoad));
    this.loadMusic();
  }

  public enqueueEvent(soundEvent: SoundEvent): void {
    this.eventQueue.push(soundEvent);
    if (this.eventQueue.length === 1) {
      this.handleEventQueue();
    }
  }

  public toggleSoundOutput(output: boolean): void {
    this.soundOutput = output;
    if (output) {
      this.enqueueEvent(SoundEvent.CLICK);
    }
  }

  public toggleMusicOutput(output: boolean): void {
    this.musicOutput = output;
    const music = this.howlMap.get("music");
    if (!music) {
      return;
    }
    if (output) {
      music.fade(0, 1, 500);
    } else {
      music.fade(1, 0, 500);
    }
  }

  public startMusic(): void {
    const howl = this.howlMap.get("music");
    if (howl === undefined) {
      return;
    }
    if (!this.musicOutput) {
      howl.volume(0);
    }
    howl.play();
  }

  private load(soundWithoutExtList: string[]) {
    const basePath = process.env.PUBLIC_URL + "/sounds/";
    soundWithoutExtList.forEach((soundWithoutExt) => {
      const webmPath = basePath + soundWithoutExt + ".webm";
      const mp3Path = basePath + soundWithoutExt + ".mp3";
      this.howlMap.set(
        soundWithoutExt,
        new Howl({ src: [webmPath, mp3Path], preload: true })
      );
    });
  }

  private loadMusic() {
    this.howlMap.set(
      "music",
      new Howl({
        src: process.env.PUBLIC_URL + "/sounds/music.mp3",
        html5: true,
        loop: true,
      })
    );
  }

  private handleEventQueue() {
    const evt = this.eventQueue[0];
    const def = soundEventDefinitionMap.get(evt);
    if (def === undefined) {
      return;
    }

    this.handleEventDefinition(def);

    if (def.waitTime === 0) {
      this.handleNextEventQueue();
    }

    setTimeout(this.handleNextEventQueue.bind(this), def.waitTime);
  }

  private handleNextEventQueue() {
    // pop the previously played event first
    this.eventQueue.shift();
    if (this.eventQueue.length === 0) {
      return;
    }

    this.handleEventQueue();
  }

  private handleEventDefinition(def: SoundEventDefinition) {
    const howl = this.howlMap.get(def.soundWithoutExt);
    if (!howl) {
      return;
    }
    if (this.soundOutput) {
      howl.play();
    }
  }
}

export function createSoundLogic() {
  return new SoundLogicImple();
}
