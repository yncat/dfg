import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react";
import AutoRead from "./autoRead";
import { createGlobalLogicForTest } from "../testHelper";
import { createAutoReadLogic } from "../logic/autoRead";

test("render updated autoRead using AutoReadLogic", () => {
  const gl = createGlobalLogicForTest();
  const arl = createAutoReadLogic();
  render(<AutoRead globalLogic={gl} autoReadLogic={arl} />);
  act(() => {
    arl.enqueue("updated");
  });
  const e = screen.getByText("updated");
  expect(e).toBeInTheDocument();
});
