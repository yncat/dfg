export class Pubsub<T> {
  private latest: T | null;
  private readonly subscribersMap: Map<number, (newValue: T) => void>;
  private internalCount: number;
  constructor() {
    this.latest = null;
    this.subscribersMap = new Map<number, (newValue: T) => void>();
    this.internalCount = 0;
  }

  public subscribe(func: (newValue: T) => void): number {
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

  public publish(newValue: T) {
    this.latest = newValue;
    this.subscribersMap.forEach((f) => {
      f(newValue);
    });
  }

  public fetchLatest(): T | null {
    return this.latest;
  }
}
