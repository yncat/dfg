import React from "react";
import Version from "./components/version";
import ConnectionStatus from "./components/connectionStatus";
import { GlobalLogic } from "./logic/global";

export type Props = {
  globalLogic: GlobalLogic
};

function App(props:Props) {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [playerCount,setPlayerCount] = React.useState<number>(0);
  // connect to server on mount.
  React.useEffect(()=>{
    props.globalLogic.subscribeConnectionEvent((isConnected:boolean)=>{setIsConnected(isConnected)});
    props.globalLogic.connect();
  },[]);
  return (
    <div className="App">
      <ConnectionStatus globalLogic={props.globalLogic} isConnected={isConnected} playerCount={playerCount} />
      <Version />
    </div>
  );
}

export default App;
