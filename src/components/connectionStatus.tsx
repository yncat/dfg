import React from "react";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
  isConnected: boolean;
  playerCount: number;
}

export default function ConnectionStatus(props: Props) {
  const i18n = props.globalLogic.i18n;
  const stat = props.isConnected
    ? i18n.connectionStatus_connected(props.playerCount)
    : i18n.connectionStatus_connecting();
  return <h1>{i18n.connectionStatus_mainServer() + ": " + stat}</h1>;
}
