import React from "react";
import { render, screen } from "@testing-library/react";
import ConnectionStatus from "./connectionStatus";
import { createGlobalLogicForTest } from "../testHelper";

test("renders not connected status", () => {
  const gl = createGlobalLogicForTest();
  render(
    <ConnectionStatus globalLogic={gl} connectionStatusString={"not_connected"} playerCount={0} />
  );
  const e = screen.getByText("メインサーバー: 未接続");
  expect(e).toBeInTheDocument();
});

test("renders connecting status", () => {
  const gl = createGlobalLogicForTest();
  render(
    <ConnectionStatus globalLogic={gl} connectionStatusString={"connecting"} playerCount={0} />
  );
  const e = screen.getByText("メインサーバー: 接続中...");
  expect(e).toBeInTheDocument();
});

test("renders connected status and player count", () => {
  const gl = createGlobalLogicForTest();
  render(
    <ConnectionStatus globalLogic={gl} connectionStatusString="connected" playerCount={3} />
  );
  const e = screen.getByText("メインサーバー: 接続済み(現在オンライン: 3)");
  expect(e).toBeInTheDocument();
});
