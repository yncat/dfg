import React from "react";
import { GlobalLogic } from "../logic/global";
import { GameLogic } from "../logic/game";
import GameInfo from "./gameInfo";
import { GameState } from "../logic/schema-def/GameState";

interface Props {
  globalLogic: GlobalLogic;
  gameLogic: GameLogic;
}

export default function GameContainer(props: Props) {
  const [gameState, setGameState] = React.useState(new GameState());
  React.useEffect(() => {
    const id = props.gameLogic.pubsubs.stateUpdate.subscribe(setGameState);
    setGameState(props.gameLogic.fetchLatestState());
    return () => {
      props.gameLogic.pubsubs.stateUpdate.unsubscribe(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <GameInfo globalLogic={props.globalLogic} gameState={gameState} />
    </div>
  );
}
