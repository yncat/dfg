import React from "react";
import { GlobalLogic } from "../logic/global";
import { GameStateDTO } from "../logic/gameState";

interface Props {
  globalLogic: GlobalLogic;
  gameState: GameStateDTO;
  isOwner: boolean;
}

export default function GameInfo(props: Props) {
  const i18n = props.globalLogic.i18n;
  let stat:string;
  if (props.gameState.isInGame) {
    stat = i18n.currentRoom_currentStatusPlaying();
  } else {
    stat = i18n.currentRoom_currentStatusWaiting(
      props.gameState.ownerPlayerName,
      props.isOwner
    );
  }

  return (
    <div>
      <h2>
        {i18n.currentRoom_roomName(props.gameState.ownerPlayerName) +
          i18n.currentRoom_playerCount(props.gameState.playerCount)}
      </h2>
      <p>
        {i18n.currentRoom_memberListLabel() +
          i18n.currentRoom_memberList(props.gameState.playerNameList)}
      </p>
      <p>{i18n.currentRoom_currentStatusLabel() + stat}</p>
      <p>
        {i18n.currentRoom_lastResultHeader() +
          i18n.currentRoom_result(props.gameState.lastGameResult)}
      </p>
    </div>
  );
}
