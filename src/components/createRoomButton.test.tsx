import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateRoomButton from "./createRoomButton";
import { createGlobalLogicForTest, createClickEvent } from "../testHelper";

test("renders create room button", () => {
  const gl = createGlobalLogicForTest();
  render(<CreateRoomButton globalLogic={gl} />);
  const e = screen.getByText("ルームを作成");
  expect(e).toBeInTheDocument();
});

test("renders room settings dialog when clicked", () => {
  const gl = createGlobalLogicForTest();
  render(<CreateRoomButton globalLogic={gl} />);
  const e = screen.getByText("ルームを作成");
  fireEvent(e, createClickEvent());
  const e2 = screen.getByText("ルームの設定");
  expect(e2).toBeInTheDocument();
});
