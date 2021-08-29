import { GlobalLogic } from "../logic/global";

interface Props{
  globalLogic:GlobalLogic;
  lobbyOrRoom:'lobby'|'room';
}

export default function ChatPanel(props:Props) {
  const i18n = props.globalLogic.i18n.chat;
  return (
    <div>
		<label>{i18n.inputLabel(props.lobbyOrRoom)} <input type="text" maxLength={200} /></label>
		<button type="button">{i18n.send()}</button>
    </div>
  );
}
