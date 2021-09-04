import React from "react";
import Version from "./components/version";
import ConnectionStatus from "./components/connectionStatus";
import LobbyContainer from "./components/lobbyContainer";
import Chat from "./components/chat";
import Settings from "./components/settings";
import AutoRead from "./components/autoRead";
import { ConnectionStatusString, GlobalLogic } from "./logic/global";
import { RoomListLogic } from "./logic/roomList";
import { SubLogicList } from "./logic/sub";
import { createSubLogicListForTest } from "./testHelper";
import { SoundEvent } from "./logic/sound";

export type Props = {
  globalLogic: GlobalLogic;
  subLogicList: SubLogicList;
};

function App(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [connectionStatusString, setConnectionStatusString] =
    React.useState<ConnectionStatusString>("not_connected");
  const [playerCount, setPlayerCount] = React.useState<number>(0);
  // connect to server on mount.
  React.useEffect(() => {
    props.globalLogic.subscribeConnectionEvent(
      (connectionStatusString: ConnectionStatusString, playerCount: number) => {
        setConnectionStatusString(connectionStatusString);
        setPlayerCount(playerCount);
        if (connectionStatusString === "connected") {
          props.globalLogic.sound.enqueueEvent(SoundEvent.CONNECTED);
          <props className="globalLogic sound start">();</props>
          props.globalLogic.updateAutoRead(i18n.login_connected(playerCount));
        }
      },
      (e: unknown) => {
        const error = e as Error;
        if(error.code===undefined){
          alert(i18n.login_serverOffline());
          return;
        }
        alert(i18n.login_cannotConnect()+JSON.stringify(error));
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
            props.globalLogic.updateAutoRead(i18n.login_connecting());
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
