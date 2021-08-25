import React from "react";
import { render, screen } from "@testing-library/react";
import CreateRoomButton from "./createRoomButton";
import { createGlobalLogicForTest } from "../testHelper";

test("renders create room button", () => {
  const gl = createGlobalLogicForTest();
  render(
    <CreateRoomButton globalLogic={gl} />
  );
  const e = screen.getByText("ルームを作成");
  expect(e).toBeInTheDocument();
});
