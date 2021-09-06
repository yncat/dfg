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

interface ConnectionError {
  code?: number;
}

export type Props = {
  globalLogic: GlobalLogic;
  subLogicList: SubLogicList;
};

function App(props: Props) {
  // TODO: delete after implementing the actual logic
  const [name, setName] = React.useState<string>(
    "cat" + Math.floor(Math.random() * 1000)
  );
  const i18n = props.globalLogic.i18n;
  const [connectionStatusString, setConnectionStatusString] =
    React.useState<ConnectionStatusString>("not_connected");
  const [playerCount, setPlayerCount] = React.useState<number>(0);
  React.useEffect(() => {
    props.globalLogic.connectionStatusPubsub.subscribe(
      (connectionStatusString: string) => {
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
            props.globalLogic.connect(name);
          }}
        >
          {props.globalLogic.i18n.login_as(name)}
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
