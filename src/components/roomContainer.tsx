import React from "react";
import { GlobalLogic } from "../logic/global";
interface Props {
  globalLogic: GlobalLogic;
}

export default function RoomContainer(props: Props) {
  return (
    <div>
      <h2>Room container</h2>
    </div>
  );
}
