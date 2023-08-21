import React from "react";
import { GlobalLogic } from "../logic/global";
import { NotifiedEvent, GameLogic } from "../logic/game";
import { GameStateDTO } from "../logic/gameState";
import GameInfo from "./gameInfo";
import CardSelector from "./cardSelector";
import PlayingInfoPanel from "./playingInfoPanel";
import { GameState } from "../logic/schema-def/GameState";
import { SoundEvent } from "../logic/sound";
import {
  CardListMessage,
  encodeCardListMessage,
  DiscardPairListMessage,
  encodeDiscardPairListMessage,
  WaitReason,
  YourTurnContext,
} from "dfg-messages";
import LeaveRoomButton from "./leaveRoomButton";

interface Props {
  globalLogic: GlobalLogic;
  gameLogic: GameLogic;
  onLeave: () => void;
}

export default function GameContainer(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [gameState, setGameState] = React.useState<GameStateDTO>(
    new GameStateDTO(new GameState())
  );
  const [ownerStatus, setOwnerStatus] = React.useState<boolean>(false);
  const [isPassable, setIsPassable] = React.useState<boolean>(false);
  const [cardList, setCardList] = React.useState<CardListMessage>(
    encodeCardListMessage([])
  );
  const [discardPairList, setDiscardPairList] =
    React.useState<DiscardPairListMessage>(encodeDiscardPairListMessage([]));
  const [log, setLog] = React.useState<Array<string>>([]);
  const updateLog = (content: string) => {
    setLog((prev: Array<string>) => {
      let newlog = [content, ...prev];
      return newlog;
    });
  };

  const handleEventLog = (evt: NotifiedEvent) => {
    evt.event.soundEvents.forEach((e) => {
      if (!evt.shouldSkipEffects) {
        props.globalLogic.sound.enqueueEvent(e);
      }
    });
    evt.event.messages.forEach((m) => {
      updateLog(m);
      if (!evt.shouldSkipEffects) {
        props.globalLogic.updateAutoRead(m);
      }
    });
  };

  const handlePlayerJoined = (name: string) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.JOINED);
    const msg = i18n.game_playerJoined(name);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handlePlayerLeft = (name: string) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.LEFT);
    const msg = i18n.game_playerLeft(name);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleMyTurn = (context:YourTurnContext, passable:boolean) => {
    const myTurn = context !== YourTurnContext.INACTIVE;
    if (myTurn) {
      const msg = i18n.game_yourTurn(context);
      props.globalLogic.updateAutoRead(msg);
      props.globalLogic.sound.enqueueEvent(SoundEvent.TURN);
      setIsPassable(passable);
    } else {
      setIsPassable(false);
    }
  };

  const handleLost = (playerName: string) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.LOST);
    const msg = i18n.game_playerLost(playerName);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleReconnected = (playerName: string) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.RECONNECTED);
    const msg = i18n.game_playerReconnected(playerName);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handlePlayerWait = (playerName: string, reason: WaitReason) => {
    const msg = i18n.game_playerWait(playerName, reason);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

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
    const id5 = props.gameLogic.pubsubs.cardListUpdated.subscribe(setCardList);
    const id6 =
      props.gameLogic.pubsubs.discardPairListUpdated.subscribe(
        setDiscardPairList
      );
    const id7 =
      props.gameLogic.pubsubs.eventLogUpdate.subscribe(handleEventLog);

    props.gameLogic.pipelines.yourTurn.register(handleMyTurn);
    props.gameLogic.pipelines.lost.register(handleLost);
    props.gameLogic.pipelines.reconnected.register(handleReconnected);
    props.gameLogic.pipelines.wait.register(handlePlayerWait);
    return () => {
      props.gameLogic.pubsubs.stateUpdate.unsubscribe(id1);
      props.gameLogic.pubsubs.gameOwnerStatus.unsubscribe(id2);
      props.gameLogic.pubsubs.playerJoined.unsubscribe(id3);
      props.gameLogic.pubsubs.playerLeft.unsubscribe(id4);
      props.gameLogic.pubsubs.cardListUpdated.unsubscribe(id5);
      props.gameLogic.pubsubs.discardPairListUpdated.unsubscribe(id6);
      props.gameLogic.pubsubs.eventLogUpdate.unsubscribe(id7);
      props.gameLogic.pipelines.yourTurn.unregister();
      props.gameLogic.pipelines.lost.unregister();
      props.gameLogic.pipelines.reconnected.unregister();
      props.gameLogic.pipelines.wait.unregister();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const startButtonDisabled = gameState.playerCount <= 1;
  return (
    <div>
      <LeaveRoomButton
        globalLogic={props.globalLogic}
        onLeave={() => {
          props.gameLogic.unregisterRoom();
          props.globalLogic.leaveGameRoom();
          props.onLeave();
        }}
      />
      <GameInfo
        globalLogic={props.globalLogic}
        gameState={gameState}
        isOwner={ownerStatus}
      />
      {!gameState.isInGame && ownerStatus === true ? (
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
      <CardSelector
        globalLogic={props.globalLogic}
        cardList={cardList}
        discardPairList={discardPairList}
        onCardSelectionChange={props.gameLogic.selectCard.bind(props.gameLogic)}
        onDiscard={props.gameLogic.discard.bind(props.gameLogic)}
        onPass={props.gameLogic.pass.bind(props.gameLogic)}
        isPassable={isPassable}
      />
      <PlayingInfoPanel
        globalLogic={props.globalLogic}
        logContents={log}
        gameState={gameState}
      />
    </div>
  );
}
