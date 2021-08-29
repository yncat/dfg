import React from "react";
import { render, screen } from "@testing-library/react";
import ChatPanel from "./chatPanel";
import { createGlobalLogicForTest } from "../testHelper";
import { createChatMessageListLogic } from "../logic/chatMessageList";

function createSubLogicList(){
	return {chatMessageListLogic: createChatMessageListLogic()}
}

test("renders chat panel for lobby", () => {
  const gl = createGlobalLogicForTest();
  const sbl = createSubLogicList();
  render(
    <ChatPanel globalLogic={gl} lobbyOrRoom="lobby" subLogicList={sbl}/>
  );
  const lobbymsg = screen.getByText("ロビーへのメッセージ");
  const lobbysend = screen.getByText("送信");
  expect(lobbymsg).toBeInTheDocument();
  expect(lobbysend).toBeInTheDocument();
});

test("renders chat panel for room", () => {
	const gl = createGlobalLogicForTest();
	const sbl = createSubLogicList();
	render(
	  <ChatPanel globalLogic={gl} lobbyOrRoom="room" subLogicList={sbl}/>
	);
	const roommsg = screen.getByText("ルームへのメッセージ");
	const roomsend = screen.getByText("送信");
	expect(roommsg).toBeInTheDocument();
	expect(roomsend).toBeInTheDocument();
  });
