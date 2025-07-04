import { Pipeline } from "./pipeline";
import { vi } from "vitest";

type TestPipelineFunc = (num: number) => void;

function makeFuncs() {
  return vi.fn((num: number) => {});
}

describe("pipeline", () => {
  it("calls pipeline function", () => {
    const pipeline = new Pipeline<TestPipelineFunc>();
    const f1 = makeFuncs();
    pipeline.register(f1);
    pipeline.call(1);
    expect(f1).toHaveBeenCalledWith(1);
  });

  it("does nothing when no pipeline function is registered", () => {
    const pipeline = new Pipeline<TestPipelineFunc>();
    expect(() => {
      pipeline.call(1);
    }).not.toThrow();
  });

  it("does nothing after unregestering", () => {
    const pipeline = new Pipeline<TestPipelineFunc>();
    const f1 = makeFuncs();
    pipeline.register(f1);
    pipeline.unregister();
    expect(() => {
      pipeline.call(1);
    }).not.toThrow();
  });
});
