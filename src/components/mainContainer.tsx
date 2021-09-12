import React from "react";
import { GlobalLogic } from "../logic/global";
import { RoomListLogic } from "../logic/roomList";
import { ChatMessageListLogic } from "../logic/chatMessageList";
import { ChatPanelLogic } from "../logic/chatPanel";
import LobbyContainer from "./lobbyContainer";
import Chat from "./chat";

interface SubLogicList {
  roomListLogic: RoomListLogic;
  lobbyChatMessageListLogic: ChatMessageListLogic;
  lobbyChatPanelLogic: ChatPanelLogic;
  roomChatMessageListLogic: ChatMessageListLogic;
  roomChatPanelLogic: ChatPanelLogic;
}

interface Props {
  globalLogic: GlobalLogic;
  subLogicList: SubLogicList;
  isInRoom: boolean;
}

export default function MainContainer(props: Props) {
  return (
    <div>
      <LobbyContainer
        globalLogic={props.globalLogic}
        roomListLogic={props.subLogicList.roomListLogic}
      />
      <Chat
        globalLogic={props.globalLogic}
        subLogicList={{
          lobbyChatMessageListLogic:
            props.subLogicList.lobbyChatMessageListLogic,
          lobbyChatPanelLogic: props.subLogicList.lobbyChatPanelLogic,
          roomChatMessageListLogic: props.subLogicList.roomChatMessageListLogic,
          roomChatPanelLogic: props.subLogicList.roomChatPanelLogic,
        }}
        isInRoom={props.isInRoom}
      />
    </div>
  );
}
