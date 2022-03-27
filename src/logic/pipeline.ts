export class Pipeline<T extends (...args: any) => void> {
  private pipeFunction: T | null;
  constructor() {
    this.pipeFunction = null;
  }

  public register(pipeFunction: T) {
    this.pipeFunction = pipeFunction;
  }

  public unregister() {
    this.pipeFunction = null;
  }

  public call(...args: Parameters<T>) {
    if (this.pipeFunction) {
      this.pipeFunction(...args);
    }
  }
}
