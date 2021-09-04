import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "./settings";
import { createGlobalLogicForTest } from "../testHelper";

test("render sound and music related settings", () => {
  const gl = createGlobalLogicForTest();
  render(<Settings globalLogic={gl} />);
  const toggleSound = screen.getByText("効果音を鳴らす");
  const toggleMusic = screen.getByText("音楽を鳴らす");
  expect(toggleSound).toBeInTheDocument();
  expect(toggleMusic).toBeInTheDocument();
});
