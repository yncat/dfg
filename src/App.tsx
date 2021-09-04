import React from "react";
import Version from "./components/version";
import ConnectionStatus from "./components/connectionStatus";
import { ConnectionStatusString } from "./components/connectionStatus";
import LobbyContainer from "./components/lobbyContainer";
import Chat from "./components/chat";
import Settings from "./components/settings";
import AutoRead from "./components/autoRead";
import { GlobalLogic } from "./logic/global";
import { RoomListLogic } from "./logic/roomList";
import { SubLogicList } from "./logic/sub";
import { createSubLogicListForTest } from "./testHelper";
import { SoundEvent } from "./logic/sound";

export type Props = {
  globalLogic: GlobalLogic;
  subLogicList: SubLogicList;
};

function App(props: Props) {
  const [connectionStatusString, setConnectionStatusString] =
    React.useState<ConnectionStatusString>("not_connected");
  const [playerCount, setPlayerCount] = React.useState<number>(0);
  // connect to server on mount.
  React.useEffect(() => {
    props.globalLogic.subscribeConnectionEvent(
      (isConnected: boolean, playerCount: number) => {
        setConnectionStatusString(isConnected ? "connected" : "not_connected");
        setPlayerCount(playerCount);
        if(isConnected){
          props.globalLogic.sound.enqueueEvent(SoundEvent.CONNECTED)
        }
      }
    );
  }, []);
  return (
    <div className="App">
      <ConnectionStatus
        globalLogic={props.globalLogic}
        connectionStatusString={connectionStatusString}
        playerCount={playerCount}
      />
      {connectionStatusString === "not_connected" ? (
        <button
          type="button"
          onClick={() => {
            props.globalLogic.sound.initIfNeeded();
            props.globalLogic.connect();
          }}
        >
          {props.globalLogic.i18n.login_as("player")}
        </button>
      ) : null}
      {connectionStatusString === "connected" ? (
        <LobbyContainer
          globalLogic={props.globalLogic}
          roomListLogic={props.subLogicList.roomListLogic}
        />
      ) : null}
      {connectionStatusString === "connected" ? (
        <Chat
          globalLogic={props.globalLogic}
          subLogicList={{
            lobbyChatMessageListLogic:
              props.subLogicList.lobbyChatMessageListLogic,
            roomChatMessageListLogic:
              props.subLogicList.roomChatMessageListLogic,
          }}
        />
      ) : null}

      <Settings globalLogic={props.globalLogic} />
      <Version />
      <AutoRead
        globalLogic={props.globalLogic}
        autoReadLogic={props.subLogicList.autoReadLogic}
      />
    </div>
  );
}

export default App;
