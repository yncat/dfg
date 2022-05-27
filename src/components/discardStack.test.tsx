import React from "react";
import { render, screen } from "@testing-library/react";
import DiscardStack from "./discardStack";
import { createGlobalLogicForTest } from "../testHelper";
import { CardDTO, DiscardPairDTO } from "../logic/gameState";
import { CardMark } from "dfg-messages";

test("renders discard stack", () => {
  const gl = createGlobalLogicForTest();
  const ds = [
    new DiscardPairDTO(
      new CardDTO(CardMark.CLUBS as number, 4),
      new CardDTO(CardMark.CLUBS as number, 4)
    ),
  ];

  render(<DiscardStack globalLogic={gl} discardStack={ds} />);
  const e = screen.getByText("クラブの4、クラブの4の2枚");
  expect(e).toBeInTheDocument();
});

test("renders no cards when the list is empty", () => {
  const gl = createGlobalLogicForTest();
  render(<DiscardStack globalLogic={gl} discardStack={[]} />);
  const e = screen.getByText("場に出ているカードはありません。");
  expect(e).toBeInTheDocument();
});
