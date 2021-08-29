import React from "react";
import Version from "./components/version";
import ConnectionStatus from "./components/connectionStatus";
import LobbyContainer from "./components/lobbyContainer";
import Chat from "./components/chat";
import { GlobalLogic } from "./logic/global";
import { RoomListLogic } from "./logic/roomList";
import { SubLogicList } from "./logic/sub";
import { createSubLogicListForTest } from "./testHelper";

export type Props = {
  globalLogic: GlobalLogic;
  subLogicList:SubLogicList;
};

function App(props: Props) {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [playerCount, setPlayerCount] = React.useState<number>(0);
  // connect to server on mount.
  React.useEffect(() => {
    props.globalLogic.subscribeConnectionEvent((isConnected: boolean,playerCount:number) => {
      setIsConnected(isConnected);
      setPlayerCount(playerCount);
    });
    props.globalLogic.connect();
  }, []);
  return (
    <div className="App">
      <ConnectionStatus
        globalLogic={props.globalLogic}
        isConnected={isConnected}
        playerCount={playerCount}
      />
      {isConnected ? <LobbyContainer globalLogic={props.globalLogic} roomListLogic={props.subLogicList.roomListLogic}/> : null}
      {isConnected ? <Chat globalLogic={props.globalLogic}/> : null}

      <Version />
    </div>
  );
}

export default App;
