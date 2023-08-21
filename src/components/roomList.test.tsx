import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RoomList from "./roomList";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
  createClickEvent,
} from "../testHelper";
import { createRoomListEntry } from "../logic/roomList";
import { RoomState, SkipConfig, RuleConfig } from "dfg-messages";

function createRuleConfig(): RuleConfig {
  return {
    yagiri: true,
    jBack: true,
    kakumei: true,
    reverse: false,
    skip: SkipConfig.OFF,
    transfer: false,
    exile: false,
  };
}

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
  const ent = createRoomListEntry(
    "cat",
    2,
    RoomState.WAITING,
    createRuleConfig(),
    ["cat", "dog"],
    "abcdabcd"
  );
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
  const ent = createRoomListEntry(
    "cat",
    2,
    RoomState.WAITING,
    createRuleConfig(),
    ["cat"],
    "abcdabcd"
  );
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
  const ent = createRoomListEntry(
    "cat",
    2,
    RoomState.PLAYING,
    createRuleConfig(),
    ["cat"],
    "abcdabcd"
  );
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return [ent];
  });
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("ゲーム中");
  const b = screen.getByText("観戦");
  expect(e).toBeInTheDocument();
  expect(b).toBeInTheDocument();
});

test("renders rule configuration status", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  const ent = createRoomListEntry(
    "cat",
    2,
    RoomState.PLAYING,
    createRuleConfig(),
    ["cat"],
    "abcdabcd"
  );
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return [ent];
  });
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("8切り、11バック、革命");
  expect(e).toBeInTheDocument();
});

test("changes button label and disabled status when joining", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  const ents = [
    createRoomListEntry(
      "cat",
      2,
      RoomState.WAITING,
      createRuleConfig(),
      ["cat"],
      "abcdabcd"
    ),
    createRoomListEntry(
      "dog",
      2,
      RoomState.PLAYING,
      createRuleConfig(),
      ["dog"],
      "abcdabcd"
    ),
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
  fireEvent(e1, createClickEvent());

  expect(e1).toHaveTextContent("参加中...");
  expect(e1).toBeDisabled();
  expect(e2).toHaveTextContent("観戦");
  expect(e2).toBeDisabled();
});
