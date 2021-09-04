import React from "react";
import { ConnectionStatusString, GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
  connectionStatusString: ConnectionStatusString;
  playerCount: number;
}

export default function ConnectionStatus(props: Props) {
  const i18n = props.globalLogic.i18n;
  const stat =
    props.connectionStatusString === "connected"
      ? i18n.connectionStatus_connected(props.playerCount)
      : props.connectionStatusString === "connecting"
      ? i18n.connectionStatus_connecting()
      : i18n.connectionStatus_notConnected();
  return <h1>{i18n.connectionStatus_mainServer() + ": " + stat}</h1>;
}
