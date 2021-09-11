import React from "react";
import { render, screen } from "@testing-library/react";
import RoomList from "./roomList";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "../testHelper";
import { createRoomListEntry } from "../logic/roomList";
import { RoomState } from "dfg-messages";

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
