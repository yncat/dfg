import React from "react";
import { render, screen } from "@testing-library/react";
import Log from "./log";
import { createGlobalLogicForTest } from "../testHelper";

test("renders list contents", () => {
  const gl = createGlobalLogicForTest();
  const contents = ["a", "b", "c"];
  render(<Log globalLogic={gl} contents={contents} />);
  contents.forEach((v) => {
    const e = screen.getByText(v);
    expect(e).toBeInTheDocument();
  });
});
