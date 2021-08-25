import React from "react";
import { render, screen } from "@testing-library/react";
import LobbyContainer from "./lobbyContainer";
import { createGlobalLogicForTest } from "../testHelper";

test("contains CreateRoomButton", () => {
  const gl = createGlobalLogicForTest();
  render(<LobbyContainer globalLogic={gl} />);
  const e = screen.getByText("ルームを作成");
  expect(e).toBeInTheDocument();
});
