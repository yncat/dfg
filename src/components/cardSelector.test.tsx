import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react";
import CardSelector from "./cardSelector";
import { createGlobalLogicForTest } from "../testHelper";
import { createCardSelectorLogic } from "../logic/cardSelector";
import { CardMark, encodeCardListMessage, encodeSelectableCardMessage } from "dfg-messages";

test("render updated cardSelector using CardSelectorLogic", () => {
  const gl = createGlobalLogicForTest();
  const csl = createCardSelectorLogic();
  const msg = encodeCardListMessage([
	  encodeSelectableCardMessage(CardMark.DIAMONDS,5,false,false),
	  encodeSelectableCardMessage(CardMark.DIAMONDS,6,true,true),
	  encodeSelectableCardMessage(CardMark.DIAMONDS,7,false,true),
  ]);
  render(<CardSelector globalLogic={gl} cardSelectorLogic={csl} />);
  act(()=>{csl.update(msg)});
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
