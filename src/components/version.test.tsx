import React from "react";
import { render, screen } from "@testing-library/react";
import Version from "./version";
import { version } from "../version";

test("renders version", () => {
  render(<Version />);
  const e = screen.getByText("Version: " + version);
  expect(e).toBeInTheDocument();
});
