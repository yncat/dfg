import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Connection from "./connection";
import { Config } from "../logic/config";
import { createGlobalLogic } from "../logic/global";
import { createI18nService } from "../i18n/i18n";
import { SoundLogic } from "../logic/sound";
import { Reconnection } from "../logic/reconnection";
import { mock } from "jest-mock-extended";
import { createClickEvent } from "../testHelper";

test("renders normal login", () => {
  const rmock = mock<Reconnection>();
  rmock.getReconnectionInfo.mockReturnValue({
    isReconnectionAvailable: false,
    playerName: "",
    reconnectionToken: "",
  });
  const gl = createGlobalLogic(
    createI18nService("Japanese"),
    mock<SoundLogic>(),
    new Config(undefined),
    rmock
  );
  render(<Connection globalLogic={gl} />);
  const name = screen.getByText("名前");
  expect(name).toBeInTheDocument();
});

test("renders reconnection login", () => {
  const rmock = mock<Reconnection>();
  rmock.getReconnectionInfo.mockReturnValue({
    isReconnectionAvailable: true,
    playerName: "cat",
    reconnectionToken: "aabb",
  });
  const gl = createGlobalLogic(
    createI18nService("Japanese"),
    mock<SoundLogic>(),
    new Config(undefined),
    rmock
  );
  render(<Connection globalLogic={gl} />);
  const desc = screen.getByText(/接続情報が残っています/);
  expect(desc).toBeInTheDocument();
  const btn = screen.getByText("catとして再接続");
  expect(btn).toBeInTheDocument();
});

test("renders normal login after pressing dismiss", () => {
  const rmock = mock<Reconnection>();
  rmock.getReconnectionInfo.mockReturnValue({
    isReconnectionAvailable: true,
    playerName: "cat",
    reconnectionToken: "aabb",
  });
  rmock.endSession.mockImplementation(() => {
    rmock.getReconnectionInfo.mockReturnValue({
      isReconnectionAvailable: false,
      playerName: "",
      reconnectionToken: "",
    });
  });
  const gl = createGlobalLogic(
    createI18nService("Japanese"),
    mock<SoundLogic>(),
    new Config(undefined),
    rmock
  );
  render(<Connection globalLogic={gl} />);
  const btn = screen.getByText("接続情報を破棄");
  expect(btn).toBeInTheDocument();
  fireEvent(btn, createClickEvent());
  const nameInput = screen.getByLabelText("名前");
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).toHaveValue("");
});
