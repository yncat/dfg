import React from "react";
import { render, screen } from "@testing-library/react";
import LobbyContainer from "./lobbyContainer";
import { createGlobalLogicForTest, createSubLogicListForTest } from "../testHelper";

test("contains CreateRoomButton", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  render(<LobbyContainer globalLogic={gl} roomListLogic={rll}/>);
  const e = screen.getByText("ルームを作成");
  expect(e).toBeInTheDocument();
  const e2 = screen.getByText("参加");
  expect(e2).toBeInTheDocument();
});
