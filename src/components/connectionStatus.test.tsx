import React from "react";
import { render, screen } from "@testing-library/react";
import ConnectionStatus from "./connectionStatus";
import { createGlobalLogicForTest } from "../testHelper";

test("renders not connected status", () => {
  const gl = createGlobalLogicForTest();
  render(
    <ConnectionStatus globalLogic={gl} isConnected={false} playerCount={0} />
  );
  const e = screen.getByText("メインサーバー: 接続中...");
  expect(e).toBeInTheDocument();
});

test("renders connected status and player count", () => {
	const gl = createGlobalLogicForTest();
	render(
	  <ConnectionStatus globalLogic={gl} isConnected={true} playerCount={3} />
	);
	const e = screen.getByText("メインサーバー: 接続済み(現在オンライン: 3)");
	expect(e).toBeInTheDocument();
  });
  