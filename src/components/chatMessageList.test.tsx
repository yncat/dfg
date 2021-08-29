import React from "react";
import { render, screen } from "@testing-library/react";
import ChatMessageList from "./chatMessageList";
import { createGlobalLogicForTest } from "../testHelper";
import { createChatMessageListLogic } from "../logic/chatMessageList";

test("renders chat message list", () => {
  const gl = createGlobalLogicForTest();
  const cmll = createChatMessageListLogic();
  render(<ChatMessageList globalLogic={gl} chatMessageListLogic={cmll} />);
  const msg1 = screen.getByText("cat: test1");
  const msg2 = screen.getByText("dog: test2");
  expect(msg1).toBeInTheDocument();
  expect(msg2).toBeInTheDocument();
});
