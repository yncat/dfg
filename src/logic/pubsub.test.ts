import { Pubsub } from "./pubsub";
import { vi } from "vitest";

function makeFuncs() {
  const f1 = vi.fn((num: number) => {});
  const f2 = vi.fn((num: number) => {});
  return [f1, f2];
}

describe("pubsub", () => {
  it("can get subscriber indices", () => {
    const pubsub = new Pubsub<number>();
    const [f1, f2] = makeFuncs();
    expect(pubsub.subscribe(f1)).toBe(1);
    expect(pubsub.subscribe(f2)).toBe(2);
  });

  it("calls all subscribers when published", () => {
    const pubsub = new Pubsub<number>();
    const [f1, f2] = makeFuncs();
    pubsub.subscribe(f1);
    pubsub.subscribe(f2);
    pubsub.publish(1);
    expect(f1).toHaveBeenCalledWith(1);
    expect(f2).toHaveBeenCalledWith(1);
  });

  it("does not call unsubscribed function", () => {
    const pubsub = new Pubsub<number>();
    const [f1, f2] = makeFuncs();
    pubsub.subscribe(f1);
    const f2id = pubsub.subscribe(f2);
    pubsub.unsubscribe(f2id);
    pubsub.publish(1);
    expect(f1).toHaveBeenCalledWith(1);
    expect(f2).not.toHaveBeenCalled();
  });

  it("the initial value is null", () => {
    const pubsub = new Pubsub<number>();
    expect(pubsub.fetchLatest()).toBeNull();
  });

  it("the last published result can be retrieved using fetchLatest", () => {
    const pubsub = new Pubsub<number>();
    pubsub.publish(1);
    expect(pubsub.fetchLatest()).toBe(1);
  });

  it("fetchLatest result can be cleared by clearLatest", () => {
    const pubsub = new Pubsub<number>();
    pubsub.publish(1);
    pubsub.clearLatest();
    expect(pubsub.fetchLatest()).toBeNull();
  });
});
