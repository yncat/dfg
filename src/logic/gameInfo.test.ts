import { GameResult, GameInfo } from "./gameInfo";
import { Result } from "./schema-def/Result";
import { GameState } from "./schema-def/GameState";

function createResult() {
  const res = new Result();
  res.daifugoPlayerList.push("cat");
  res.fugoPlayerList.push("dog");
  res.heiminPlayerList.push("rabbit", "lion");
  res.hinminPlayerList.push("tiger");
  res.daihinminPlayerList.push("monkey");
  return res;
}
describe("GameResult", () => {
  it("is constructable", () => {
    const res = createResult();
    const gres = new GameResult(res);
    expect(gres.daifugoPlayerList).toStrictEqual(["cat"]);
    expect(gres.fugoPlayerList).toStrictEqual(["dog"]);
    expect(gres.heiminPlayerList).toStrictEqual(["rabbit", "lion"]);
    expect(gres.hinminPlayerList).toStrictEqual(["tiger"]);
    expect(gres.daihinminPlayerList).toStrictEqual(["monkey"]);
  });
});
