import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "./testHelper";

test("renders version and connection info when not connected", () => {
  const globalLogic = createGlobalLogicForTest();
  const subLogicList = createSubLogicListForTest();
  jest.spyOn(globalLogic, "connect").mockImplementation(() => {});
  render(<App globalLogic={globalLogic} subLogicList={subLogicList} />);
  const cs = screen.getByText("メインサーバー: 接続中...");
  const ver = screen.getByText(/Version/);
  expect(cs).toBeInTheDocument();
  expect(ver).toBeInTheDocument();
});

test("renders properly when connected", () => {
  const globalLogic = createGlobalLogicForTest();
  const subLogicList = createSubLogicListForTest();
  jest
    .spyOn(globalLogic, "subscribeConnectionEvent")
    .mockImplementation((onConnectionStatusChanged) => {
      onConnectionStatusChanged(true, 2);
    });
  jest.spyOn(globalLogic, "connect").mockImplementation(() => {});
  render(<App globalLogic={globalLogic} subLogicList={subLogicList} />);
  const cs = screen.getByText("メインサーバー: 接続済み(現在オンライン: 2)");
  const crb = screen.getByText("ルームを作成");
  const ver = screen.getByText(/Version/);
  expect(cs).toBeInTheDocument();
  expect(ver).toBeInTheDocument();
});
