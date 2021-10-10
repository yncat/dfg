import { GameResultDTO, GameStateDTO } from "./gameState";
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
describe("GameResultDTO", () => {
  it("is constructable", () => {
    const res = createResult();
    const gres = new GameResultDTO(res);
    expect(gres.daifugoPlayerList).toStrictEqual(["cat"]);
    expect(gres.fugoPlayerList).toStrictEqual(["dog"]);
    expect(gres.heiminPlayerList).toStrictEqual(["rabbit", "lion"]);
    expect(gres.hinminPlayerList).toStrictEqual(["tiger"]);
    expect(gres.daihinminPlayerList).toStrictEqual(["monkey"]);
  });
});

describe("GameStateDTO", () => {
  it("is constructable", () => {
    const lgr = createResult();
    const cgr = createResult();
    const gs = new GameState();
    gs.lastGameResult = lgr;
    gs.currentGameResult = cgr;
    gs.playerCount = 2;
    gs.playerNameList.push("cat", "dog");
    gs.ownerPlayerName = "cat";
    gs.isInGame = true;
    const gi = new GameStateDTO(gs);
    expect(gi.playerCount).toBe(2);
    expect(gi.playerNameList).toStrictEqual(["cat", "dog"]);
    expect(gi.ownerPlayerName).toBe("cat");
    expect(gi.isInGame).toBeTruthy();
    expect(gi.lastGameResult.daifugoPlayerList[0]).toBe("cat");
    expect(gi.currentGameResult.daifugoPlayerList[0]).toBe("cat");
  });
});
