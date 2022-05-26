import React from "react";
import { render, screen } from "@testing-library/react";
import { ArraySchema } from "@colyseus/schema";
import CurrentRoomInfo from "./gameInfo";
import { createGlobalLogicForTest } from "../testHelper";
import { GameState } from "../logic/schema-def/GameState";
import { Result } from "../logic/schema-def/Result";
import * as dto from "../logic/gameState"

test("render currentRoomInfo for waiting status", () => {
  const gl = createGlobalLogicForTest();
  const state = new GameState();
  state.ownerPlayerName = "cat";
  state.playerCount = 6;
  state.playerNameList = new ArraySchema<string>(
    "cat",
    "dog",
    "rabbit",
    "lion",
    "tiger",
    "monkey"
  );
  const lr = new Result();
  lr.daifugoPlayerList = new ArraySchema<string>("cat");
  lr.fugoPlayerList = new ArraySchema<string>("rabbit");
  lr.heiminPlayerList = new ArraySchema<string>("tiger", "lion");
  lr.hinminPlayerList = new ArraySchema<string>("dog");
  lr.daihinminPlayerList = new ArraySchema<string>("monkey");
  state.lastGameResult = lr;
  const gsdto = new dto.GameStateDTO(state);
  render(
    <CurrentRoomInfo globalLogic={gl} gameState={gsdto} isOwner={false} />
  );
  const heading = screen.getByText("catさんのルーム(6人)");
  const memberList = screen.getByText(
    "メンバー: cat、dog、rabbit、lion、tiger、monkey"
  );
  const stat = screen.getByText(
    "現在の状況: catさんがゲームを開始するまで待機しています。"
  );
  const lastRes = screen.getByText(
    "前回の結果: catが大富豪。rabbitが富豪。tiger、lionが平民。dogが貧民。monkeyが大貧民。"
  );
  expect(heading).toBeInTheDocument();
  expect(memberList).toBeInTheDocument();
  expect(stat).toBeInTheDocument();
  expect(lastRes).toBeInTheDocument();
});

test("empty result", () => {
  const gl = createGlobalLogicForTest();
  const state = new GameState();
  state.ownerPlayerName = "cat";
  state.playerCount = 6;
  state.playerNameList = new ArraySchema<string>(
    "cat",
    "dog",
    "rabbit",
    "lion",
    "tiger",
    "monkey"
  );
  const gsdto = new dto.GameStateDTO(state);
  render(<CurrentRoomInfo globalLogic={gl} gameState={gsdto} isOwner={true} />);
  const lastRes = screen.getByText("前回の結果: 結果なし。");
  expect(lastRes).toBeInTheDocument();
});
