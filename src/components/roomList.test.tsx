import React from "react";
import { render, screen } from "@testing-library/react";
import RoomList from "./roomList";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "../testHelper";
import { createRoomListEntry } from "../logic/roomList";

test("renders room list table", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  const ent = createRoomListEntry("cat", 2, "abcdabcd");
  jest.spyOn(rll, "fetchLatest").mockImplementation(() => {
    return [ent];
  });
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("cat");
  expect(e).toBeInTheDocument();
});
