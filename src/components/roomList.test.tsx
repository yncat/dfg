import React from "react";
import { render, screen } from "@testing-library/react";
import RoomList from "./roomList";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "../testHelper";

test("renders room list table", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  render(<RoomList globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("cat");
  expect(e).toBeInTheDocument();
});
