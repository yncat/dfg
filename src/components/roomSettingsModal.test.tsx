import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RoomSettingsModal from "./roomSettingsModal";
import { createGlobalLogicForTest, createClickEvent } from "../testHelper";
import { SkipConfig } from "dfg-messages";
import { vi } from "vitest";

test("renders settings with given parameters", () => {
  const gl = createGlobalLogicForTest();
  const yagiri = true;
  const jBack = false;
  const kakumei = true;
  const reverse = false;
  const skip = SkipConfig.OFF;
  const transfer = false;
  const exile = false;
  const onYagiriChange = vi.fn((yagiri: boolean) => {});
  const onJBackChange = vi.fn((jBack: boolean) => {});
  const onKakumeiChange = vi.fn((kakumei: boolean) => {});
  const onReverseChange = vi.fn((reverse: boolean) => {});
  const onSkipChange = vi.fn((skip: SkipConfig) => {});
  const onTransferChange = vi.fn((transfer: boolean) => {});
  const onExileChange = vi.fn((exile: boolean) => {});
  render(
    <RoomSettingsModal
      globalLogic={gl}
      yagiri={yagiri}
      jBack={jBack}
      kakumei={kakumei}
      reverse={reverse}
      skip={skip}
      transfer={transfer}
      exile={exile}
      onYagiriChange={onYagiriChange}
      onJBackChange={onJBackChange}
      onKakumeiChange={onKakumeiChange}
      onReverseChange={onReverseChange}
      onSkipChange={onSkipChange}
      onTransferChange={onTransferChange}
      onExileChange={onExileChange}
    />
  );
  const yagiriCb = screen.getByLabelText(/8切り/);
  expect(yagiriCb).toBeChecked();
  const jBackCb = screen.getByLabelText(/11バック/);
  expect(jBackCb).not.toBeChecked();
  const kakumeiCb = screen.getByLabelText(/革命/);
  expect(kakumeiCb).toBeChecked();
  const reverseCb = screen.getByLabelText(/リバース/);
  expect(reverseCb).not.toBeChecked();
  const skipOffRadio = screen.getByLabelText(/飛ばさない/);
  const skipSingleRadio = screen.getByLabelText(/シングルスキップ/);
  const skipMultiRadio = screen.getByLabelText(/マルチスキップ/);
  expect(skipOffRadio).toBeChecked();
  expect(skipSingleRadio).not.toBeChecked();
  expect(skipMultiRadio).not.toBeChecked();
  const transferCb = screen.getByLabelText(/7渡し/);
  expect(transferCb).not.toBeChecked();
  const exileCb = screen.getByLabelText(/10捨て/);
  expect(exileCb).not.toBeChecked();
});

test("can change settings", () => {
  const gl = createGlobalLogicForTest();
  const yagiri = true;
  const jBack = false;
  const kakumei = true;
  const reverse = false;
  const skip = SkipConfig.OFF;
  const transfer = false;
  const exile = false;
  const onYagiriChange = vi.fn((yagiri: boolean) => {});
  const onJBackChange = vi.fn((jBack: boolean) => {});
  const onKakumeiChange = vi.fn((kakumei: boolean) => {});
  const onReverseChange = vi.fn((reverse: boolean) => {});
  const onSkipChange = vi.fn((skip: SkipConfig) => {});
  const onTransferChange = vi.fn((transfer: boolean) => {});
  const onExileChange = vi.fn((exile: boolean) => {});
  render(
    <RoomSettingsModal
      globalLogic={gl}
      yagiri={yagiri}
      jBack={jBack}
      kakumei={kakumei}
      reverse={reverse}
      skip={skip}
      transfer={transfer}
      exile={exile}
      onYagiriChange={onYagiriChange}
      onJBackChange={onJBackChange}
      onKakumeiChange={onKakumeiChange}
      onReverseChange={onReverseChange}
      onSkipChange={onSkipChange}
      onTransferChange={onTransferChange}
      onExileChange={onExileChange}
    />
  );
  const yagiriCb = screen.getByLabelText(/8切り/);
  fireEvent(yagiriCb, createClickEvent());
  expect(onYagiriChange).toHaveBeenCalledWith(!yagiri);
  const jBackCb = screen.getByLabelText(/11バック/);
  fireEvent(jBackCb, createClickEvent());
  expect(onJBackChange).toHaveBeenCalledWith(!jBack);
  const kakumeiCb = screen.getByLabelText(/革命/);
  fireEvent(kakumeiCb, createClickEvent());
  expect(onKakumeiChange).toHaveBeenCalledWith(!kakumei);
  const reverseCb = screen.getByLabelText(/リバース/);
  fireEvent(reverseCb, createClickEvent());
  expect(onReverseChange).toHaveBeenCalledWith(!reverse);
  const skipSingleRadio = screen.getByLabelText(/シングルスキップ/);
  fireEvent(skipSingleRadio, createClickEvent());
  expect(onSkipChange).toHaveBeenCalledWith(SkipConfig.SINGLE);
  onSkipChange.mockClear();
  const skipMultiRadio = screen.getByLabelText(/マルチスキップ/);
  fireEvent(skipMultiRadio, createClickEvent());
  expect(onSkipChange).toHaveBeenCalledWith(SkipConfig.MULTI);
  const transferCb = screen.getByLabelText(/7渡し/);
  fireEvent(transferCb, createClickEvent());
  expect(onTransferChange).toHaveBeenCalledWith(!transfer);
  const exileCb = screen.getByLabelText(/10捨て/);
  fireEvent(exileCb, createClickEvent());
  expect(onExileChange).toHaveBeenCalledWith(!exile);
});
