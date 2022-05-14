import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RoomList from "./roomList";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "../testHelper";
import { createRoomListEntry } from "../logic/roomList";
import { RoomState } from "dfg-messages";

test("renders no room message when no rooms are available", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return [];
  });
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText(/利用可能なルームはありません/);
  expect(e).toBeInTheDocument();
});

test("renders room list table", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  const ent = createRoomListEntry("cat", 2, RoomState.WAITING, "abcdabcd");
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return [ent];
  });
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("cat");
  expect(e).toBeInTheDocument();
});

test("renders waiting status", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  const ent = createRoomListEntry("cat", 2, RoomState.WAITING, "abcdabcd");
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return [ent];
  });
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("待機中");
  const b = screen.getByText("参加");
  expect(e).toBeInTheDocument();
  expect(b).toBeInTheDocument();
});

test("renders playing status", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  const ent = createRoomListEntry("cat", 2, RoomState.PLAYING, "abcdabcd");
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return [ent];
  });
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("ゲーム中");
  const b = screen.getByText("観戦");
  expect(e).toBeInTheDocument();
  expect(b).toBeInTheDocument();
});

test("changes button label and disabled status when joining", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  const ents = [
    createRoomListEntry("cat", 2, RoomState.WAITING, "abcdabcd"),
    createRoomListEntry("dog", 2, RoomState.PLAYING, "abcdabcd"),
  ];
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return ents;
  });
  jest
    .spyOn(gl, "joinGameRoomByID")
    .mockImplementation(
      (roomID: string, onFinish: (success: boolean) => void) => {}
    );
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e1 = screen.getByText("参加");
  const e2 = screen.getByText("観戦");
  fireEvent(e1, new MouseEvent("click", { bubbles: true, cancelable: true }));

  expect(e1).toHaveTextContent("参加中...");
  expect(e1).toBeDisabled();
  expect(e2).toHaveTextContent("観戦");
  expect(e2).toBeDisabled();
});
