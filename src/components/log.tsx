import React from "react";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
  contents: Array<string>;
}

export default function Log(props: Props) {
  const i18n = props.globalLogic.i18n;
  return (
    <div>
      <h2>{i18n.gameLog_heading()}</h2>
      <ul>
        {props.contents.map((v, i) => {
          return <li key={i}>{v}</li>;
        })}
      </ul>
    </div>
  );
}
