import React from "react";
import { render, screen } from "@testing-library/react";
import GameContainer from "./gameContainer";
import {
  createGlobalLogicForTest,
  createSubLogicListForTest,
} from "../testHelper";
import { GameState } from "../logic/schema-def/GameState";
import { GameStateDTO } from "../logic/gameState";

test("show game start button when the user is the game owner", () => {
  const gl = createGlobalLogicForTest();
  const gml = createSubLogicListForTest().gameLogic;
  gml.pubsubs.gameOwnerStatus.publish(true);
  const state = new GameState();
  state.playerCount = 2;
  gml.pubsubs.stateUpdate.publish(new GameStateDTO(state));
  render(<GameContainer globalLogic={gl} gameLogic={gml} />);
  const btn = screen.getByText("ゲーム開始");
  expect(btn).toBeInTheDocument();
});

test("button is disabled when only one player is in the room", () => {
  const gl = createGlobalLogicForTest();
  const gml = createSubLogicListForTest().gameLogic;
  gml.pubsubs.gameOwnerStatus.publish(true);
  const state = new GameState();
  state.playerCount = 1;
  gml.pubsubs.stateUpdate.publish(new GameStateDTO(state));
  render(<GameContainer globalLogic={gl} gameLogic={gml} />);
  const btn = screen.getByText("一人ではゲームを開始できません");
  expect(btn).toBeInTheDocument();
  expect(btn).toBeDisabled();
});
