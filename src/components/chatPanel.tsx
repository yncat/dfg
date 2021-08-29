import { GlobalLogic } from "../logic/global";
import ChatMessageList from "./chatMessageList";
import { ChatMessageListLogic } from "../logic/chatMessageList";

interface SubLogicList{
  chatMessageListLogic:ChatMessageListLogic;
}

interface Props{
  globalLogic:GlobalLogic;
  lobbyOrRoom:'lobby'|'room';
  subLogicList:SubLogicList;
}

export default function ChatPanel(props:Props) {
  const i18n = props.globalLogic.i18n.chat;
  return (
    <div>
		<label>{i18n.inputLabel(props.lobbyOrRoom)} <input type="text" maxLength={200} /></label>
		<button type="button">{i18n.send()}</button>
    <ChatMessageList globalLogic={props.globalLogic} chatMessageListLogic={props.subLogicList.chatMessageListLogic}/>
    </div>
  );
}
