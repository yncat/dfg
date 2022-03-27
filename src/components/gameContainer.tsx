import React from "react";
import { GlobalLogic } from "../logic/global";
import { GameLogic } from "../logic/game";
import { GameStateDTO } from "../logic/gameState";
import GameInfo from "./gameInfo";
import { GameState } from "../logic/schema-def/GameState";
import { SoundEvent } from "../logic/sound";

interface Props {
  globalLogic: GlobalLogic;
  gameLogic: GameLogic;
}

export default function GameContainer(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [gameState, setGameState] = React.useState<GameStateDTO>(
    new GameStateDTO(new GameState())
  );
  const [ownerStatus, setOwnerStatus] = React.useState<boolean>(false);
  const handlePlayerJoined = (name: string) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.JOINED);
    props.globalLogic.updateAutoRead(i18n.game_playerJoined(name));
  };
  const handlePlayerLeft = (name: string) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.LEFT);
    props.globalLogic.updateAutoRead(i18n.game_playerLeft(name));
  };
  const handleInitialInfo = (playerCount: number, deckCount: number) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.START);
    props.globalLogic.sound.enqueueEvent(SoundEvent.SHUFFLE);
    props.globalLogic.sound.enqueueEvent(SoundEvent.GIVE);
    props.globalLogic.updateAutoRead(
      i18n.game_initialInfo(playerCount, deckCount)
    );
  };
  const handleCardsProvided = (playerName: string, cardCount: number) => {
    props.globalLogic.updateAutoRead(
      i18n.game_cardsProvided(playerName, cardCount)
    );
  };

  const handleYourTurn = () => {
    props.globalLogic.updateAutoRead(i18n.game_yourTurn());
    props.globalLogic.sound.enqueueEvent(SoundEvent.TURN);
  };

  const handleTurn = (playerName:string)=>{
    props.globalLogic.updateAutoRead(i18n.game_turn(playerName));
  }

  React.useEffect(() => {
    const id1 = props.gameLogic.pubsubs.stateUpdate.subscribe(setGameState);
    const latest = props.gameLogic.pubsubs.stateUpdate.fetchLatest();
    if (latest) {
      setGameState(latest);
    }
    const id2 =
      props.gameLogic.pubsubs.gameOwnerStatus.subscribe(setOwnerStatus);
    if (props.gameLogic.pubsubs.gameOwnerStatus.fetchLatest() === true) {
      setOwnerStatus(true);
    }
    const id3 =
      props.gameLogic.pubsubs.playerJoined.subscribe(handlePlayerJoined);
    const name = props.gameLogic.pubsubs.playerJoined.fetchLatest();
    if (name !== null) {
      handlePlayerJoined(name);
    }
    const id4 = props.gameLogic.pubsubs.playerLeft.subscribe(handlePlayerLeft);
    props.gameLogic.pipelines.initialInfo.register(handleInitialInfo);
    props.gameLogic.pipelines.cardsProvided.register(handleCardsProvided);
    props.gameLogic.pipelines.yourTurn.register(handleYourTurn);
    props.gameLogic.pipelines.turn.register(handleTurn);
    return () => {
      props.gameLogic.pubsubs.stateUpdate.unsubscribe(id1);
      props.gameLogic.pubsubs.gameOwnerStatus.unsubscribe(id2);
      props.gameLogic.pubsubs.playerJoined.unsubscribe(id3);
      props.gameLogic.pubsubs.playerLeft.unsubscribe(id4);
      props.gameLogic.pipelines.initialInfo.unregister();
      props.gameLogic.pipelines.cardsProvided.unregister();
      props.gameLogic.pipelines.yourTurn.unregister();
      props.gameLogic.pipelines.turn.unregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const startButtonDisabled = gameState.playerCount <= 1;
  return (
    <div>
      <GameInfo
        globalLogic={props.globalLogic}
        gameState={gameState}
        isOwner={ownerStatus}
      />
      {ownerStatus === true ? (
        <button
          type="button"
          disabled={startButtonDisabled}
          onClick={(evt) => {
            props.gameLogic.startGame();
          }}
        >
          {startButtonDisabled
            ? i18n.currentRoom_cannotStartGame()
            : i18n.currentRoom_startGame()}
        </button>
      ) : null}
    </div>
  );
}
