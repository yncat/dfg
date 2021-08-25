import React from "react";
import { GlobalLogic } from "../logic/global";
import CreateRoomButton from "./createRoomButton";

interface Props {
  globalLogic: GlobalLogic;
}

export default function LobbyContainer(props: Props) {
  return (
    <div>
      <CreateRoomButton globalLogic={props.globalLogic} />
    </div>
  );
}
