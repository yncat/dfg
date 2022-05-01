import React from "react";
import Version from "./components/version";
import ConnectionStatus from "./components/connectionStatus";
import MainContainer from "./components/mainContainer";
import Settings from "./components/settings";
import AutoRead from "./components/autoRead";
import { ConnectionStatusString, GlobalLogic } from "./logic/global";
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
  // TODO: delete after switched to session-based
  const [pname, setPname] = React.useState<string>(
    props.globalLogic.registeredPlayerName
  );
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
    props.globalLogic.isInRoomPubsub.subscribe((isInRoom: boolean) => {
      setIsInRoom(isInRoom);
      // 退室したときはもうgameRoomにいないので、退室メッセージを受け取れない。なので手動でイベント発生させる。
      if (!isInRoom) {
        props.globalLogic.sound.enqueueEvent(SoundEvent.LEFT);
        props.globalLogic.updateAutoRead(i18n.currentRoom_left());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="App">
      <ConnectionStatus
        globalLogic={props.globalLogic}
        connectionStatusString={connectionStatusString}
        playerCount={playerCount}
      />
      {connectionStatusString === "not_connected" ? (
        <React.Fragment>
          <label>
            名前{" "}
            <input
              type="text"
              maxLength={20}
              value={pname}
              onChange={(e) => {
                setPname(e.target.value);
                props.globalLogic.registeredPlayerName = e.target.value;
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              props.globalLogic.updateAutoRead(i18n.login_connecting());
              props.globalLogic.sound.initIfNeeded();
              props.globalLogic.connect();
            }}
          >
            {props.globalLogic.i18n.login_as(pname)}
          </button>
        </React.Fragment>
      ) : null}
      {connectionStatusString === "connected" ? (
        <MainContainer
          globalLogic={props.globalLogic}
          subLogicList={{
            roomListLogic: props.subLogicList.roomListLogic,
            gameLogic: props.subLogicList.gameLogic,
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
