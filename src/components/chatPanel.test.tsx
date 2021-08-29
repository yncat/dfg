import React from "react";
import { render, screen } from "@testing-library/react";
import ChatPanel from "./chatPanel";
import { createGlobalLogicForTest } from "../testHelper";

test("renders chat panel for lobby", () => {
  const gl = createGlobalLogicForTest();
  render(
    <ChatPanel globalLogic={gl} lobbyOrRoom="lobby"/>
  );
  const lobbymsg = screen.getByText("ロビーへのメッセージ");
  const lobbysend = screen.getByText("送信");
  expect(lobbymsg).toBeInTheDocument();
  expect(lobbysend).toBeInTheDocument();
});

test("renders chat panel for room", () => {
	const gl = createGlobalLogicForTest();
	render(
	  <ChatPanel globalLogic={gl} lobbyOrRoom="room"/>
	);
	const roommsg = screen.getByText("ルームへのメッセージ");
	const roomsend = screen.getByText("送信");
	expect(roommsg).toBeInTheDocument();
	expect(roomsend).toBeInTheDocument();
  });
