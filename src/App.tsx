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
import { SoundEvent } from "./logic/sound";

interface ConnectionError {
  code?: number;
}

export type Props = {
  globalLogic: GlobalLogic;
  subLogicList: SubLogicList;
};

function App(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [connectionStatusString, setConnectionStatusString] =
    React.useState<ConnectionStatusString>("not_connected");
  const [playerCount, setPlayerCount] = React.useState<number>(0);
  const [isInRoom, setIsInRoom] = React.useState<boolean>(false);
  React.useEffect(() => {
    props.globalLogic.connectionStatusPubsub.subscribe(
      (connectionStatusString: ConnectionStatusString) => {
        setConnectionStatusString(connectionStatusString);
        if (connectionStatusString === "connected") {
          props.globalLogic.sound.enqueueEvent(SoundEvent.CONNECTED);
          props.globalLogic.sound.startMusic();
          props.globalLogic.updateAutoRead(i18n.login_connected());
        }
      }
    );
    props.globalLogic.connectionErrorPubsub.subscribe((e: unknown) => {
      const error = e as ConnectionError;
      if (error.code === undefined) {
        alert(i18n.login_serverOffline());
        return;
      }
      alert(i18n.login_cannotConnect() + JSON.stringify(error));
    });
    props.globalLogic.playerCountPubsub.subscribe(setPlayerCount);
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
          {props.globalLogic.i18n.login_as(
            props.globalLogic.registeredPlayerName
          )}
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
            lobbyChatPanelLogic: props.subLogicList.lobbyChatPanelLogic,
            roomChatMessageListLogic:
              props.subLogicList.roomChatMessageListLogic,
            roomChatPanelLogic: props.subLogicList.roomChatPanelLogic,
          }}
          isInRoom={isInRoom}
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
