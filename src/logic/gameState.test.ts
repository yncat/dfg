import { ArraySchema } from "@colyseus/schema";
import * as dto from "./gameState";
import { Result } from "./schema-def/Result";
import { GameState } from "./schema-def/GameState";
import { Card } from "./schema-def/Card";
import { DiscardPair } from "./schema-def/DiscardPair";
import { RemovedCardEntry } from "./schema-def/RemovedCardEntry";
import { SkipConfig } from "dfg-messages";

function createResult() {
  const res = new Result();
  res.daifugoPlayerList.push("cat");
  res.fugoPlayerList.push("dog");
  res.heiminPlayerList.push("rabbit", "lion");
  res.hinminPlayerList.push("tiger");
  res.daihinminPlayerList.push("monkey");
  return res;
}

function createDiscardStack(): ArraySchema<DiscardPair> {
  const dp = new DiscardPair();
  const c = new Card();
  c.mark = 1;
  c.cardNumber = 2;
  dp.cards.push(c);
  return new ArraySchema<DiscardPair>(dp);
}

function createRemovedCardEntry(): ArraySchema<RemovedCardEntry> {
  const e = new RemovedCardEntry();
  e.mark = 1;
  e.cardNumber = 2;
  e.count = 3;
  return new ArraySchema<RemovedCardEntry>(e);
}

describe("GameResultDTO", () => {
  it("is constructable", () => {
    const res = createResult();
    const gres = new dto.GameResultDTO(res);
    expect(gres.daifugoPlayerList).toStrictEqual(["cat"]);
    expect(gres.fugoPlayerList).toStrictEqual(["dog"]);
    expect(gres.heiminPlayerList).toStrictEqual(["rabbit", "lion"]);
    expect(gres.hinminPlayerList).toStrictEqual(["tiger"]);
    expect(gres.daihinminPlayerList).toStrictEqual(["monkey"]);
  });
});

describe("CardDTO", () => {
  it("is constructable", () => {
    const c = new dto.CardDTO(1, 2);
    expect(c.mark).toBe(1);
    expect(c.cardNumber).toBe(2);
  });
});

describe("DiscardPairDTO", () => {
  it("is constructable", () => {
    const c1 = new dto.CardDTO(1, 2);
    const c2 = new dto.CardDTO(3, 4);
    const dp = new dto.DiscardPairDTO(c1, c2);
    expect(dp.cards.length).toBe(2);
    expect(dp.cards[0]).toStrictEqual(c1);
    expect(dp.cards[1]).toStrictEqual(c2);
  });
});

describe("RemovedCardEntryDTO", () => {
  it("is constructable", () => {
    const e = new dto.RemovedCardEntryDTO(1, 2, 3);
    expect(e.mark).toBe(1);
    expect(e.cardNumber).toBe(2);
    expect(e.count).toBe(3);
  });
});

describe("GameStateDTO", () => {
  it("is constructable", () => {
    const lgr = createResult();
    const cgr = createResult();
    const ds = createDiscardStack();
    const es = createRemovedCardEntry();

    const gs = new GameState();
    gs.lastGameResult = lgr;
    gs.currentGameResult = cgr;
    gs.playerCount = 2;
    gs.playerNameList.push("cat", "dog");
    gs.ownerPlayerName = "cat";
    gs.isInGame = true;
    gs.discardStack = ds;
    gs.removedCardList = es;
    gs.ruleConfig.yagiri = true;
    gs.ruleConfig.jBack = true;
    gs.ruleConfig.kakumei = true;
    gs.ruleConfig.reverse = true;
    gs.ruleConfig.skip = SkipConfig.MULTI;
    const gi = new dto.GameStateDTO(gs);
    expect(gi.playerCount).toBe(2);
    expect(gi.playerNameList).toStrictEqual(["cat", "dog"]);
    expect(gi.ownerPlayerName).toBe("cat");
    expect(gi.isInGame).toBeTruthy();
    expect(gi.lastGameResult.daifugoPlayerList[0]).toBe("cat");
    expect(gi.currentGameResult.daifugoPlayerList[0]).toBe("cat");
    expect(gi.discardStack.length).toBe(1);
    expect(gi.discardStack[0].cards.length).toBe(1);
    expect(gi.discardStack[0].cards[0]).toStrictEqual(new dto.CardDTO(1, 2));
    expect(gi.removedCardList.length).toBe(1);
    expect(gi.removedCardList[0]).toStrictEqual(
      new dto.RemovedCardEntryDTO(1, 2, 3)
    );
    expect(gi.ruleConfig).toStrictEqual({
      yagiri: true,
      jBack: true,
      kakumei: true,
      reverse: true,
      skip: SkipConfig.MULTI,
    });
  });
});
