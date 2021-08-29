import { GlobalLogic } from "../logic/global";
import { ChatMessageListLogic } from "../logic/chatMessageList";

interface Props {
  globalLogic: GlobalLogic;
  chatMessageListLogic: ChatMessageListLogic;
}

export default function ChatMessageList(props: Props) {
  return (
    <ul>
      {props.chatMessageListLogic.fetchLatest().map((v, i) => {
        return <li key={i}>{v.playerName + ": " + v.message}</li>;
      })}
    </ul>
  );
}
