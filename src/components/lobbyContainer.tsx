import React from "react";
import { GlobalLogic } from "../logic/global";
import { RoomListLogic } from "../logic/roomList";
import CreateRoomButton from "./createRoomButton";
import RoomList from "./roomList";

interface Props {
  globalLogic: GlobalLogic;
  roomListLogic:RoomListLogic;
}

export default function LobbyContainer(props: Props) {
  return (
    <div>
      <CreateRoomButton globalLogic={props.globalLogic} />
      <RoomList globalLogic={props.globalLogic} roomListLogic={props.roomListLogic} />
    </div>
  );
}
