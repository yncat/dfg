import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LeaveRoomButton from "./leaveRoomButton";
import { createGlobalLogicForTest } from "../testHelper";
import { act } from "react-dom/test-utils";

test("show confirmation when expanded", () => {
  const gl = createGlobalLogicForTest();
  render(<LeaveRoomButton globalLogic={gl} onLeave={() => {}} />);
  const e = screen.getByText("ルームを退室");
  expect(e).toBeInTheDocument();
  act(() => {
    fireEvent(e, new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  const c = screen.getByText(/本当に/);
  expect(c).toBeInTheDocument();
});
