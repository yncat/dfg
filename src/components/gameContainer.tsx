import React from "react";
import { GlobalLogic } from "../logic/global";
import { GameLogic } from "../logic/game";
import { GameStateDTO } from "../logic/gameState";
import GameInfo from "./gameInfo";
import CardSelector from "./cardSelector";
import Log from "./log";
import { GameState } from "../logic/schema-def/GameState";
import { SoundEvent } from "../logic/sound";
import {
  CardListMessage,
  encodeCardListMessage,
  DiscardPairListMessage,
  encodeDiscardPairListMessage,
  DiscardPairMessage,
  RankType,
} from "dfg-messages";
import LeaveRoomButton from "./leaveRoomButton";

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
  const [isMyTurn, setIsMyTurn] = React.useState<boolean>(false);
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

  const handleInitialInfo = (playerCount: number, deckCount: number) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.START);
    props.globalLogic.sound.enqueueEvent(SoundEvent.SHUFFLE);
    props.globalLogic.sound.enqueueEvent(SoundEvent.GIVE);
    const msg = i18n.game_initialInfo(playerCount, deckCount);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleCardsProvided = (playerName: string, cardCount: number) => {
    const msg = i18n.game_cardsProvided(playerName, cardCount);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleMyTurn = () => {
    const msg = i18n.game_yourTurn();
    props.globalLogic.updateAutoRead(msg);
    props.globalLogic.sound.enqueueEvent(SoundEvent.TURN);
    setIsMyTurn(true);
  };

  const handleTurn = (playerName: string) => {
    const msg = i18n.game_turn(playerName);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleDiscard = (
    playerName: string,
    discardPair: DiscardPairMessage,
    remainingHandCount: number
  ) => {
    setIsMyTurn(false);
    props.globalLogic.sound.enqueueEvent(SoundEvent.DISCARD);
    const msg = i18n.game_discard(playerName, discardPair, remainingHandCount);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleNagare = () => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.RESET);
    const msg = i18n.game_nagare();
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handlePass = (playerName: string, remainingHandCount: number) => {
    setIsMyTurn(false);
    props.globalLogic.sound.enqueueEvent(SoundEvent.PASS);
    const msg = i18n.game_passMessage(playerName, remainingHandCount);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleInvert = (inverted: boolean) => {
    if (inverted) {
      props.globalLogic.sound.enqueueEvent(SoundEvent.BACK);
    } else {
      props.globalLogic.sound.enqueueEvent(SoundEvent.UNBACK);
    }
    const msg = i18n.game_strengthInverted(inverted);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleKakumei = () => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.KAKUMEI);
    const msg = i18n.game_kakumei();
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleRankChanged = (
    playerName: string,
    before: RankType,
    after: RankType
  ) => {
    switch (after) {
      case RankType.DAIFUGO:
        props.globalLogic.sound.enqueueEvent(SoundEvent.DAIFUGO);
        break;
      case RankType.FUGO:
        props.globalLogic.sound.enqueueEvent(SoundEvent.FUGO);
        break;
      case RankType.HEIMIN:
        props.globalLogic.sound.enqueueEvent(SoundEvent.HEIMIN);
        break;
      case RankType.HINMIN:
        props.globalLogic.sound.enqueueEvent(SoundEvent.HINMIN);
        break;
      case RankType.DAIHINMIN:
        props.globalLogic.sound.enqueueEvent(SoundEvent.DAIHINMIN);
        break;
      default:
        break;
    }
    let msg: string;
    if (before === RankType.UNDETERMINED) {
      msg = i18n.game_ranked(playerName, after);
    } else {
      msg = i18n.game_rankChanged(playerName, before, after);
    }
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleAgari = (playerName: string) => {
    const msg = i18n.game_agari(playerName);
    props.globalLogic.updateAutoRead(msg);
    updateLog(msg);
  };

  const handleForbiddenAgari = (playerName: string) => {
    props.globalLogic.sound.enqueueEvent(SoundEvent.FORBIDDEN);
    const msg = i18n.game_forbiddenAgari(playerName);
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
    props.gameLogic.pipelines.initialInfo.register(handleInitialInfo);
    props.gameLogic.pipelines.cardsProvided.register(handleCardsProvided);
    props.gameLogic.pipelines.yourTurn.register(handleMyTurn);
    props.gameLogic.pipelines.turn.register(handleTurn);
    props.gameLogic.pipelines.discard.register(handleDiscard);
    props.gameLogic.pipelines.nagare.register(handleNagare);
    props.gameLogic.pipelines.pass.register(handlePass);
    props.gameLogic.pipelines.invert.register(handleInvert);
    props.gameLogic.pipelines.kakumei.register(handleKakumei);
    props.gameLogic.pipelines.rankChanged.register(handleRankChanged);
    props.gameLogic.pipelines.agari.register(handleAgari);
    props.gameLogic.pipelines.forbiddenAgari.register(handleForbiddenAgari);
    return () => {
      props.gameLogic.pubsubs.stateUpdate.unsubscribe(id1);
      props.gameLogic.pubsubs.gameOwnerStatus.unsubscribe(id2);
      props.gameLogic.pubsubs.playerJoined.unsubscribe(id3);
      props.gameLogic.pubsubs.playerLeft.unsubscribe(id4);
      props.gameLogic.pubsubs.cardListUpdated.unsubscribe(id5);
      props.gameLogic.pubsubs.discardPairListUpdated.unsubscribe(id6);
      props.gameLogic.pipelines.initialInfo.unregister();
      props.gameLogic.pipelines.cardsProvided.unregister();
      props.gameLogic.pipelines.yourTurn.unregister();
      props.gameLogic.pipelines.turn.unregister();
      props.gameLogic.pipelines.discard.unregister();
      props.gameLogic.pipelines.nagare.unregister();
      props.gameLogic.pipelines.pass.unregister();
      props.gameLogic.pipelines.invert.unregister();
      props.gameLogic.pipelines.kakumei.unregister();
      props.gameLogic.pipelines.rankChanged.unregister();
      props.gameLogic.pipelines.agari.unregister();
      props.gameLogic.pipelines.forbiddenAgari.unregister();
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
        isPassable={isMyTurn}
      />
      <Log globalLogic={props.globalLogic} contents={log} />
    </div>
  );
}
