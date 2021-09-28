export type AutoReadUpdateFunc = (updateString: string) => void;

export interface AutoReadLogic {
  subscribe: (onUpdate: AutoReadUpdateFunc) => void;
  unsubscribe: () => void;
  enqueue: (enqueueString: string) => void;
}

class AutoReadLogicImple implements AutoReadLogic {
  onUpdate: AutoReadUpdateFunc | null;
  readQueue: string[];
  constructor() {
    this.readQueue = [];
    this.onUpdate = null;
  }

  public subscribe(onUpdate: AutoReadUpdateFunc): void {
    this.onUpdate = onUpdate;
  }

  public unsubscribe() {
    this.onUpdate = null;
  }

  public enqueue(enqueueString: string) {
    this.readQueue.push(enqueueString);
    if (this.readQueue.length === 1) {
      this.handleQueue();
    }
  }

  private update(updateString: string) {
    if (this.onUpdate) {
      this.onUpdate(updateString);
    }
  }

  private handleQueue() {
    const s = this.readQueue[0];
    this.update(s);
    setTimeout(this.handleNextQueue.bind(this), 200);
  }

  private handleNextQueue() {
    this.readQueue.shift();
    if (this.readQueue.length === 0) {
      return;
    }

    this.handleQueue();
  }
}

export function createAutoReadLogic(): AutoReadLogic {
  return new AutoReadLogicImple();
}
