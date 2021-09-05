import { Pubsub } from "./pubsub";

type TestSubscriberFunc = (num: number) => void;

function makeFuncs() {
  const f1 = jest.fn((num: number) => {});
  const f2 = jest.fn((num: number) => {});
  return [f1, f2];
}

describe("pubsub", () => {
  it("can get subscriber indices", () => {
    const pubsub = new Pubsub<TestSubscriberFunc>();
    const [f1, f2] = makeFuncs();
    expect(pubsub.subscribe(f1)).toBe(1);
    expect(pubsub.subscribe(f2)).toBe(2);
  });

  it("calls all subscribers when published", () => {
    const pubsub = new Pubsub<TestSubscriberFunc>();
    const [f1, f2] = makeFuncs();
    pubsub.subscribe(f1);
    pubsub.subscribe(f2);
    pubsub.publish(1);
    expect(f1).toHaveBeenCalledWith(1);
    expect(f2).toHaveBeenCalledWith(1);
  });

  it("does not call unsubscribed function", () => {
    const pubsub = new Pubsub<TestSubscriberFunc>();
    const f1 = jest.fn((num: number) => {});
    const f2 = jest.fn((num: number) => {});
    pubsub.subscribe(f1);
    const f2id = pubsub.subscribe(f2);
    pubsub.unsubscribe(f2id);
    pubsub.publish(1);
    expect(f1).toHaveBeenCalledWith(1);
    expect(f2).not.toHaveBeenCalledWith(1);
  });
});
