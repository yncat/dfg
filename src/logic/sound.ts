import { Howl, Howler } from "howler";
import { textSpanIntersectsWithTextSpan } from "typescript";
export const SoundEvent = {
  CLICK: 0,
  CHAT: 1,
  CONNECTED: 2,
} as const;
export type SoundEvent = typeof SoundEvent[keyof typeof SoundEvent];

export interface SoundLogic {
  initIfNeeded: () => void;
  enqueueEvent: (soundEvent: SoundEvent) => void;
  toggleSoundOutput: (output: boolean) => void;
  toggleMusicOutput: (output: boolean) => void;
  startMusic:()=>void;
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
]);

export class SoundLogicImple implements SoundLogic {
  soundOutput: boolean;
  musicOutput: boolean;
  howlMap: Map<string, Howl>;
  eventQueue: SoundEvent[];
  constructor() {
    this.soundOutput = true;
    this.musicOutput = true;
    this.howlMap = new Map<string, Howl>();
    this.eventQueue = [];
  }

  public initIfNeeded(): void {
    this.load(["click", "chat", "connected"]);
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

  public startMusic():void{
    const howl=this.howlMap.get("music");
    if(howl===undefined){
      return;
    }
    if(!this.musicOutput){
      howl.mute();
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
    const evt = this.eventQueue.shift();
    if (evt===undefined) {
      return;
    }
    const def = soundEventDefinitionMap.get(evt);
    if (def===undefined) {
      return;
    }

    const howl = this.howlMap.get(def.soundWithoutExt);
    if (!howl) {
      return;
    }
    if(this.soundOutput){
      howl.play();
    }

    if (this.eventQueue.length === 0) {
      return;
    }

    if (def.waitTime === 0) {
      this.handleEventQueue();
    }

    setTimeout(this.handleEventQueue.bind(this), def.waitTime);
  }
}

export function createSoundLogic() {
  return new SoundLogicImple();
}
