import React from "react";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
}

export default function Settings(props: Props) {
  const [soundToggle, setSoundToggle] = React.useState<boolean>(true);
  const [musicToggle, setMusicToggle] = React.useState<boolean>(false);
  const i18n = props.globalLogic.i18n;
  return (
    <div>
      <h2>{i18n.settings_heading()}</h2>
      <label>
        <input
          type="checkbox"
          checked={soundToggle}
          onChange={() => {
            props.globalLogic.sound.toggleSoundOutput(!soundToggle);
            setSoundToggle(!soundToggle);
          }}
        />
        {i18n.settings_soundToggle()}
      </label>
      <label>
        <input
          type="checkbox"
          checked={musicToggle}
          onChange={() => {
            props.globalLogic.sound.toggleMusicOutput(!musicToggle);
            setMusicToggle(!musicToggle);
          }}
        />
        {i18n.settings_musicToggle()}
      </label>
    </div>
  );
}
