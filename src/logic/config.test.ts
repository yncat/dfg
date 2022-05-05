import { Config } from "./config";

describe("config", () => {
  it("yields default with all undefined", () => {
    const c = new Config(undefined);
    expect(c.serverAddress).toBe("localhost");
  });

  it("yields with custom server address", () => {
    const c = new Config("hogehoge.com");
    expect(c.serverAddress).toBe("hogehoge.com");
  });
});
