import React from "react";
import Version from "./components/version";
import { GlobalLogic } from "./logic/global";

export type Props = {
  logic: GlobalLogic
};

function App(props:Props) {
  return (
    <div className="App">
      <Version />
    </div>
  );
}

export default App;
