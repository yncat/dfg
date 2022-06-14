import React from "react";
import { GlobalLogic } from "../logic/global";
import { RoomListLogic } from "../logic/roomList";
import { GameLogic } from "../logic/game";
import { ChatMessageListLogic } from "../logic/chatMessageList";
import { ChatPanelLogic } from "../logic/chatPanel";
import LobbyContainer from "./lobbyContainer";
import GameContainer from "./gameContainer";
import Chat from "./chat";

interface SubLogicList {
  roomListLogic: RoomListLogic;
  gameLogic: GameLogic;
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
  const handleRoomChatClear = () => {
    props.subLogicList.roomChatMessageListLogic.clear();
  };
  return (
    <div>
      {props.isInRoom ? (
        <GameContainer
          globalLogic={props.globalLogic}
          gameLogic={props.subLogicList.gameLogic}
          onLeave={handleRoomChatClear}
        />
      ) : (
        <LobbyContainer
          globalLogic={props.globalLogic}
          roomListLogic={props.subLogicList.roomListLogic}
        />
      )}
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
