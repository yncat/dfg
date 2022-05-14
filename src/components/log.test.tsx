import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Log from "./log";
import { createGlobalLogicForTest } from "../testHelper";
import { act } from "react-dom/test-utils";

test("renders list contents", () => {
  const gl = createGlobalLogicForTest();
  const contents = ["a", "b", "c"];
  render(<Log globalLogic={gl} contents={contents} />);
  contents.forEach((v) => {
    const e = screen.getByText(v);
    expect(e).toBeInTheDocument();
  });
});

test("decrease button is disabled, and enable button is enabled by default", () => {
  const gl = createGlobalLogicForTest();
  const contents = ["a", "b", "c"];
  render(<Log globalLogic={gl} contents={contents} />);
  const inc = screen.getByText("表示を増やす");
  const dec = screen.getByText("表示を減らす");
  expect(inc).toBeInTheDocument();
  expect(inc).toBeEnabled();
  expect(dec).toBeInTheDocument();
  expect(dec).toBeDisabled();
});

test("increase button is disabled when reached to 100 entries", () => {
  const gl = createGlobalLogicForTest();
  const contents = ["a", "b", "c"];
  render(<Log globalLogic={gl} contents={contents} />);
  const inc = screen.getByText("表示を増やす");
  expect(inc).toBeInTheDocument();
  // press increase 9 times so that rowsCount reaches 100
  act(() => {
    for (let i = 0; i < 9; i++) {
      fireEvent(
        inc,
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );
    }
  });
  expect(inc).toBeDisabled();
});

test("renders list contents when increased", () => {
  const gl = createGlobalLogicForTest();
  const contents: Array<string> = [];
  for (let i = 0; i < 25; i++) {
    contents.push(i.toString());
  }
  render(<Log globalLogic={gl} contents={contents} />);
  for (let i = 0; i < 10; i++) {
    const e = screen.getByText(i.toString());
    expect(e).toBeInTheDocument();
  }
  const over1 = screen.queryByText("10");
  expect(over1).toBeNull();
  const inc = screen.getByText("表示を増やす");
  fireEvent(inc, new MouseEvent("click", { bubbles: true, cancelable: true }));
  for (let i = 0; i < 20; i++) {
    const e = screen.getByText(i.toString());
    expect(e).toBeInTheDocument();
  }
  const over2 = screen.queryByText("20");
  expect(over2).toBeNull();
});
