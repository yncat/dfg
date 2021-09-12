import React from "react";
import { render, screen } from "@testing-library/react";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "../testHelper";
import MainContainer from "./mainContainer";

test("renders lobbyContainer when the player is not in a game room", () => {
  const gl = createGlobalLogicForTest();
  const sbl = createSubLogicListForTest();
  render(
    <MainContainer
      globalLogic={gl}
      subLogicList={{
        roomListLogic: sbl.roomListLogic,
        lobbyChatMessageListLogic: sbl.lobbyChatMessageListLogic,
        lobbyChatPanelLogic: sbl.lobbyChatPanelLogic,
        roomChatMessageListLogic: sbl.roomChatMessageListLogic,
        roomChatPanelLogic: sbl.roomChatPanelLogic,
      }}
      isInRoom={false}
    />
  );
  const e = screen.getByText("ルームを作成");
  expect(e).toBeInTheDocument();
});
