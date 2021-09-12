import React from "react";
import { ChatMessage } from "dfg-messages";
import { GlobalLogic } from "../logic/global";
import { ChatMessageListLogic } from "../logic/chatMessageList";
import { SoundEvent } from "../logic/sound";

interface Props {
  globalLogic: GlobalLogic;
  chatMessageListLogic: ChatMessageListLogic;
}

export default function ChatMessageList(props: Props) {
  const [messageList, setMessageList] = React.useState<ChatMessage[]>(
    props.chatMessageListLogic.fetchLatest()
  );
  React.useEffect(() => {
    const subscriberID = props.chatMessageListLogic.pubsub.subscribe(
      (chatMessageList: ChatMessage[]) => {
        setMessageList(chatMessageList);
        props.globalLogic.sound.enqueueEvent(SoundEvent.CHAT);
        const last = chatMessageList[chatMessageList.length - 1];
        props.globalLogic.updateAutoRead(last.playerName + ": " + last.message);
      }
    );
    return () => {
      props.chatMessageListLogic.pubsub.unsubscribe(subscriberID);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ul>
      {messageList.map((v, i) => {
        return <li key={i}>{v.playerName + ": " + v.message}</li>;
      })}
    </ul>
  );
}
