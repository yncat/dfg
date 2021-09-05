export class Pubsub<T extends (...args: any) => any> {
  subscribersMap: Map<number, T>;
  internalCount: number;
  constructor() {
    this.subscribersMap = new Map<number, T>();
    this.internalCount = 0;
  }

  public subscribe(func: T): number {
    this.internalCount++;
    this.subscribersMap.set(this.internalCount, func);
    return this.internalCount;
  }

  public unsubscribe(id: number): boolean {
    if (!this.subscribersMap.has(id)) {
      return false;
    }
    this.subscribersMap.delete(id);
    return true;
  }

  public publish(...args: Parameters<T>) {
    this.subscribersMap.forEach((f) => {
      f(...args);
    });
  }
}
