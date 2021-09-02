import React from "react";
import { GlobalLogic } from "../logic/global";
import {
  CurrentRoomInfoEntry,
  CurrentRoomInfoLogic,
} from "../logic/currentRoomInfo";

interface Props {
  globalLogic: GlobalLogic;
  currentRoomInfoLogic: CurrentRoomInfoLogic;
}

export default function CurrentRoomInfo(props: Props) {
  const [info, setInfo] = React.useState<CurrentRoomInfoEntry>(
    props.currentRoomInfoLogic.fetchLatest()
  );
  const i18n = props.globalLogic.i18n;
  const stat = i18n.currentRoom_currentStatusWaiting(info.creator);

  return (
    <div>
      <h2>
        {i18n.currentRoom_roomName(info.creator) +
          i18n.currentRoom_playerCount(info.playerCount)}
      </h2>
      <p>
        {i18n.currentRoom_memberListLabel() +
          i18n.currentRoom_memberList(info.memberList)}
      </p>
      <p>{i18n.currentRoom_currentStatusLabel() + stat}</p>
      <p>
        {i18n.currentRoom_lastResultHeader() +
          i18n.currentRoom_result(
            info.lastResult.daifugoPlayerList,
            info.lastResult.fugoPlayerList,
            info.lastResult.heiminPlayerList,
            info.lastResult.hinminPlayerList,
            info.lastResult.daihinminPlayerList
          )}
      </p>
    </div>
  );
}
