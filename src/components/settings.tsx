import React from "react";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
}

export default function Settings(props: Props) {
	const [soundToggle,setSoundToggle] = React.useState<boolean>(true);
	const [musicToggle,setMusicToggle] = React.useState<boolean>(true);
	const i18n=props.globalLogic.i18n;
  return (
    <div>
		<h2>{i18n.settings_heading()}</h2>
		<label>{i18n.settings_soundToggle()}<input type="checkbox" checked={soundToggle}/></label>
		<label>{i18n.settings_musicToggle()}<input type="checkbox" checked={musicToggle}/></label>
    </div>
  );
}
