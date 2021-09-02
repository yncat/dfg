import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrentRoomInfo from "./currentRoomInfo";
import { createGlobalLogicForTest } from "../testHelper";
import { createCurrentRoomInfoLogic } from "../logic/currentRoomInfo";

test("render currentRoomInfo for waiting status", () => {
  const gl = createGlobalLogicForTest();
  const cril = createCurrentRoomInfoLogic();
  render(<CurrentRoomInfo globalLogic={gl} currentRoomInfoLogic={cril} />);
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
