import { Howl } from "howler";

const MUSIC_DEFAULT_VOL = 0.5;

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
  BACK: 13,
  UNBACK: 14,
  KAKUMEI: 15,
  DAIFUGO: 16,
  FUGO: 17,
  HEIMIN: 18,
  HINMIN: 19,
  DAIHINMIN: 20,
  FORBIDDEN: 21,
  SKIP: 22,
  REVERSE: 23,
  LOST: 24,
  RECONNECTED: 25,
  TRANSFER: 26,
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
  volume?: number;
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
  [SoundEvent.BACK, { soundWithoutExt: "back", waitTime: 600 }],
  [SoundEvent.UNBACK, { soundWithoutExt: "unback", waitTime: 600 }],
  [SoundEvent.KAKUMEI, { soundWithoutExt: "kakumei", waitTime: 700 }],
  [SoundEvent.DAIFUGO, { soundWithoutExt: "daifugo", waitTime: 2500 }],
  [SoundEvent.FUGO, { soundWithoutExt: "fugo", waitTime: 1500 }],
  [SoundEvent.HEIMIN, { soundWithoutExt: "heimin", waitTime: 1000 }],
  [SoundEvent.HINMIN, { soundWithoutExt: "hinmin", waitTime: 700 }],
  [SoundEvent.DAIHINMIN, { soundWithoutExt: "daihinmin", waitTime: 3500 }],
  [SoundEvent.FORBIDDEN, { soundWithoutExt: "forbidden", waitTime: 1200 }],
  [SoundEvent.SKIP, { soundWithoutExt: "skip", waitTime: 300 }],
  [SoundEvent.REVERSE, { soundWithoutExt: "reverse", waitTime: 1000 }],
  [SoundEvent.LOST, { soundWithoutExt: "lost", waitTime: 600, volume: 0.3 }],
  [
    SoundEvent.RECONNECTED,
    { soundWithoutExt: "reconnected", waitTime: 600, volume: 0.3 },
  ],
  [SoundEvent.TRANSFER, { soundWithoutExt: "transfer", waitTime: 700 }],
]);

export class SoundLogicImple implements SoundLogic {
  soundOutput: boolean;
  musicOutput: boolean;
  howlMap: Map<string, Howl>;
  eventQueue: SoundEvent[];
  private myTurnSoundQueued: boolean;
  private playing: boolean;
  constructor() {
    this.soundOutput = true;
    this.musicOutput = false;
    this.howlMap = new Map<string, Howl>();
    this.eventQueue = [];
    this.myTurnSoundQueued = false;
    this.playing = false;
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
    // ターンが回ってきた音だけ特殊処理
    if (soundEvent === SoundEvent.TURN) {
      this.enqueueMyTurnSound();
      return;
    }
    this.eventQueue.push(soundEvent);
    if (this.eventQueue.length === 1) {
      this.handleEventQueue();
    }
  }

  private enqueueMyTurnSound() {
    // これまでは、ただただ送られてくる順番で音を鳴らせばよかった。
    // ところが、イベントログをstate、ターンメッセージをsendでのメッセージに分けたところ、どっちが先に来るか補償されなくなってしまった。
    // ターン開始の音は、ほかの音が流れた後に再生されて欲しいので、ここだけいい感じに吸収してあげる必要が出てきた。
    this.myTurnSoundQueued = true;
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
      music.fade(0, MUSIC_DEFAULT_VOL, 500);
    } else {
      music.fade(MUSIC_DEFAULT_VOL, 0, 500);
    }
  }

  public startMusic(): void {
    const howl = this.howlMap.get("music");
    if (howl === undefined) {
      return;
    }
    howl.volume(MUSIC_DEFAULT_VOL);
    if (!this.musicOutput) {
      howl.volume(0);
    }
    howl.play();
  }

  private load(soundWithoutExtList: string[]) {
    const basePath = import.meta.env.BASE_URL + "sounds/";
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
        src: import.meta.env.BASE_URL + "sounds/music.mp3",
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

    this.playing = true;
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
      // 自分のターンが来た音が予約されていたらここで再生
      if (this.myTurnSoundQueued) {
        this.myTurnSoundQueued = false;
        this.handleEventDefinition(
          soundEventDefinitionMap.get(SoundEvent.TURN) as SoundEventDefinition
        ); // ないわけないのでtype assertionしちゃう
      }
      this.playing = false;
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
      howl.volume(def.volume === undefined ? 1 : def.volume);
      howl.play();
    }
  }
}

export function createSoundLogic() {
  return new SoundLogicImple();
}
