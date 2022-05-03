import React from "react";
import { render, screen } from "@testing-library/react";
import Version from "./version";

test("renders version", () => {
  render(<Version />);
  const e = screen.getByText(/Build version/);
  expect(e).toBeInTheDocument();
});
