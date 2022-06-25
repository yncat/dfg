import React from "react";
import Version from "./components/version";
import ConnectionStatus from "./components/connectionStatus";
import MainContainer from "./components/mainContainer";
import Settings from "./components/settings";
import AutoRead from "./components/autoRead";
import Connection from "./components/connection";
import { ConnectionStatusString, GlobalLogic } from "./logic/global";
import { SubLogicList } from "./logic/sub";
import { SoundEvent } from "./logic/sound";
import { AuthError } from "dfg-messages";

function isAuthError(e: any): e is AuthError {
  return e.code !== undefined && e.message !== undefined;
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
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (props.globalLogic.isInRoomPubsub.fetchLatest()) {
      event.preventDefault();
      event.returnValue = "aaaaa";
    }
  };
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
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
    props.globalLogic.connectionErrorPubsub.subscribe((e: any) => {
      if (isAuthError(e)) {
        alert(i18n.error_ws(e.code));
        return;
      }
      alert(i18n.login_serverOffline());
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
    <div className="App" lang={i18n.html_lang()}>
      <ConnectionStatus
        globalLogic={props.globalLogic}
        connectionStatusString={connectionStatusString}
        playerCount={playerCount}
      />
      {connectionStatusString === "not_connected" ? (
        <Connection globalLogic={props.globalLogic} />
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
