import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Chat from "./chat";
import { createGlobalLogicForTest } from "../testHelper";
import { createChatMessageListLogic } from "../logic/chatMessageList";

function createSubLogicList() {
  return {
    lobbyChatMessageListLogic: createChatMessageListLogic(),
    roomChatMessageListLogic: createChatMessageListLogic(),
  };
}

test("renders chat tab bar and lobby chat screen by default", () => {
  const gl = createGlobalLogicForTest();
  const sbl = createSubLogicList();
  render(<Chat globalLogic={gl} subLogicList={sbl} />);
  const lobbytab = screen.getByText("ロビー");
  const roomtab = screen.getByText("ロビー");
  const lobbymsg = screen.getByText("ロビーへのメッセージ");
  const lobbysend = screen.getByText("送信");
  expect(lobbytab).toBeInTheDocument();
  expect(roomtab).toBeInTheDocument();
  expect(lobbymsg).toBeInTheDocument();
  expect(lobbysend).toBeInTheDocument();
});

test("shows room chat panel when room tab is clicked", () => {
  const gl = createGlobalLogicForTest();
  const sbl = createSubLogicList();
  render(<Chat globalLogic={gl} subLogicList={sbl} />);
  fireEvent.click(screen.getByText("ルーム"));
  const roommsg = screen.getByText("ルームへのメッセージ");
  const roomsend = screen.getByText("送信");
  expect(roommsg).toBeInTheDocument();
  expect(roomsend).toBeInTheDocument();
});
