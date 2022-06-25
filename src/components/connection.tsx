import React from "react";
import { Button } from "react-bootstrap";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
}

export default function Connection(props: Props) {
  const i18n = props.globalLogic.i18n;
  const reconnectionInfo = props.globalLogic.getReconnectionInfo();
  // TODO: delete after switched to session-based
  const [pname, setPname] = React.useState<string>(
    props.globalLogic.registeredPlayerName
  );

  return reconnectionInfo.isReconnectionAvailable ? (
    <React.Fragment>
      <p>{i18n.reconnection_explanation()}</p>
      <Button variant="primary">
        {i18n.reconnection_reconnectAs(reconnectionInfo.playerName)}
      </Button>
      <Button variant="warning">{i18n.reconnection_discard()}</Button>
    </React.Fragment>
  ) : (
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
        disabled={pname === ""}
        onClick={() => {
          props.globalLogic.updateAutoRead(i18n.login_connecting());
          props.globalLogic.sound.initIfNeeded();
          props.globalLogic.connect();
        }}
      >
        {pname === ""
          ? props.globalLogic.i18n.login_needName()
          : props.globalLogic.i18n.login_as(pname)}
      </button>
    </React.Fragment>
  );
}
