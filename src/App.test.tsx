import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "./testHelper";
import { act } from "react-dom/test-utils";

test("renders version and connection info when not connected", () => {
  const globalLogic = createGlobalLogicForTest();
  const subLogicList = createSubLogicListForTest();
  render(<App globalLogic={globalLogic} subLogicList={subLogicList} />);
  const cs = screen.getByText("メインサーバー: 未接続");
  const ver = screen.getByText(/Build version/);
  expect(cs).toBeInTheDocument();
  expect(ver).toBeInTheDocument();
});

test("renders properly when connected", () => {
  const globalLogic = createGlobalLogicForTest();
  const subLogicList = createSubLogicListForTest();
  jest.spyOn(globalLogic, "connect").mockImplementation(() => {});
  render(<App globalLogic={globalLogic} subLogicList={subLogicList} />);
  act(() => {
    globalLogic.connectionStatusPubsub.publish("connected");
    globalLogic.playerCountPubsub.publish(2);
  });
  const cs = screen.getByText("メインサーバー: 接続済み(現在オンライン: 2)");
  const crb = screen.getByText("ルームを作成");
  const chat = screen.getByText("チャット");
  const ver = screen.getByText(/Build version/);
  expect(cs).toBeInTheDocument();
  expect(crb).toBeInTheDocument();
  expect(chat).toBeInTheDocument();
  expect(ver).toBeInTheDocument();
});
