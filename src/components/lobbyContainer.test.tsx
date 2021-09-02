import React from "react";
import { render, screen } from "@testing-library/react";
import LobbyContainer from "./lobbyContainer";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "../testHelper";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

test("contains CreateRoomButton", () => {
  const gl = createGlobalLogicForTest();
  const rll = createSubLogicListForTest().roomListLogic;
  render(<LobbyContainer globalLogic={gl} roomListLogic={rll} />);
  const e = screen.getByText("ルームを作成");
  expect(e).toBeInTheDocument();
});
