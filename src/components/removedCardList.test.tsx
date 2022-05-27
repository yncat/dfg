import React from "react";
import { render, screen } from "@testing-library/react";
import { createGlobalLogicForTest } from "../testHelper";
import { RemovedCardEntryDTO } from "../logic/gameState";
import { CardMark } from "dfg-messages";
import RemovedCardList from "./removedCardList";

test("renders discard stack", () => {
  const gl = createGlobalLogicForTest();
  const es = [new RemovedCardEntryDTO(CardMark.HEARTS, 3, 3)];
  render(<RemovedCardList globalLogic={gl} removedCardList={es} />);
  const e = screen.getByText("ハートの3が3枚");
  expect(e).toBeInTheDocument();
});

test("renders description when entries are empty", () => {
  const gl = createGlobalLogicForTest();
  render(<RemovedCardList globalLogic={gl} removedCardList={[]} />);
  const e = screen.getByText(
    "途中でゲームから抜けたプレイヤーのカードは、このゲーム中では使用されなくなり、ここに表示されます。"
  );
  expect(e).toBeInTheDocument();
});
