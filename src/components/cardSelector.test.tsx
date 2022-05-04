import React from "react";
import { render, screen } from "@testing-library/react";
import CardSelector from "./cardSelector";
import { createGlobalLogicForTest } from "../testHelper";
import {
  CardMark,
  encodeCardListMessage,
  encodeSelectableCardMessage,
  encodeCardMessage,
  encodeDiscardPairListMessage,
  encodeDiscardPairMessage,
} from "dfg-messages";

test("render updated cardSelector checkboxes using props", () => {
  const gl = createGlobalLogicForTest();
  const msg = encodeCardListMessage([
    encodeSelectableCardMessage(CardMark.DIAMONDS, 5, false, false),
    encodeSelectableCardMessage(CardMark.DIAMONDS, 6, true, true),
    encodeSelectableCardMessage(CardMark.DIAMONDS, 7, false, true),
  ]);
  render(
    <CardSelector
      globalLogic={gl}
      cardList={msg}
      discardPairList={encodeDiscardPairListMessage([])}
      onCardSelectionChange={(index: number) => {}}
      onDiscard={(index: number) => {}}
      onPass={() => {}}
      isPassable={true}
    />
  );
  const d5 = screen.getByText("ダイヤの5");
  const d5chk = screen.getByLabelText("ダイヤの5");
  const d6 = screen.getByText("ダイヤの6");
  const d6chk = screen.getByLabelText("ダイヤの6");
  const d7 = screen.getByText("ダイヤの7");
  const d7chk = screen.getByLabelText("ダイヤの7");
  expect(d5).toBeInTheDocument();
  expect(d5chk).toBeDisabled();
  expect(d5chk).not.toBeChecked();
  expect(d6).toBeInTheDocument();
  expect(d6chk).toBeChecked();
  expect(d6chk).toBeEnabled();
  expect(d7).toBeInTheDocument();
  expect(d7chk).not.toBeChecked();
  expect(d7chk).toBeEnabled();
});

test("render updated cardSelector buttons using props", () => {
  const gl = createGlobalLogicForTest();
  const msg = encodeDiscardPairListMessage([
    encodeDiscardPairMessage([encodeCardMessage(CardMark.SPADES, 5)]),
    encodeDiscardPairMessage([
      encodeCardMessage(CardMark.HEARTS, 7),
      encodeCardMessage(CardMark.CLUBS, 7),
    ]),
  ]);
  render(
    <CardSelector
      globalLogic={gl}
      cardList={encodeCardListMessage([])}
      discardPairList={msg}
      onCardSelectionChange={(index: number) => {}}
      onDiscard={(index: number) => {}}
      onPass={() => {}}
      isPassable={true}
    />
  );
  const btn1 = screen.getByText("スペードの5");
  const btn2 = screen.getByText("ハートの7、クラブの7の2枚");
  expect(btn1).toBeInTheDocument();
  expect(btn2).toBeInTheDocument();
});

test("when more than one card is checked, pass button is disabled", () => {
  const gl = createGlobalLogicForTest();
  const msg = encodeCardListMessage([
    encodeSelectableCardMessage(CardMark.DIAMONDS, 6, true, true),
  ]);
  render(
    <CardSelector
      globalLogic={gl}
      cardList={msg}
      discardPairList={encodeDiscardPairListMessage([])}
      onCardSelectionChange={(index: number) => {}}
      onDiscard={(index: number) => {}}
      onPass={() => {}}
      isPassable={true}
    />
  );
  const pb = screen.getByText("パス");
  expect(pb).toBeInTheDocument();
  expect(pb).toBeDisabled();
});

test("hide the passbutton when isPassable==false", () => {
  const gl = createGlobalLogicForTest();
  const msg = encodeCardListMessage([
    encodeSelectableCardMessage(CardMark.DIAMONDS, 6, false, false),
  ]);
  render(
    <CardSelector
      globalLogic={gl}
      cardList={msg}
      discardPairList={encodeDiscardPairListMessage([])}
      onCardSelectionChange={(index: number) => {}}
      onDiscard={(index: number) => {}}
      onPass={() => {}}
      isPassable={false}
    />
  );
  const pb = screen.queryByText("パス");
  expect(pb).toBeNull();
});
