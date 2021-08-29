import React from "react";
import { render, screen } from "@testing-library/react";
import Chat from "./chat";
import { createGlobalLogicForTest } from "../testHelper";

test("renders chat tab bar and lobby chat screen by default", () => {
  const gl = createGlobalLogicForTest();
  render(
    <Chat globalLogic={gl}/>
  );
  const lobbytab = screen.getByText("ロビー");
  const roomtab = screen.getByText("ロビー");
  expect(lobbytab).toBeInTheDocument();
  expect(roomtab).toBeInTheDocument();
});
