import React from "react";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
}

export default function CreateRoomButton(props: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        props.globalLogic.createGameRoom();
      }}
    >
      {props.globalLogic.i18n.createRoomButton_createRoom()}
    </button>
  );
}
