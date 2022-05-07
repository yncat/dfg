import React from "react";
import { GlobalLogic } from "../logic/global";
import ChatMessageList from "./chatMessageList";
import { ChatMessageListLogic } from "../logic/chatMessageList";
import { ChatPanelLogic } from "../logic/chatPanel";

interface SubLogicList {
  chatMessageListLogic: ChatMessageListLogic;
}

interface Props {
  globalLogic: GlobalLogic;
  lobbyOrRoom: "lobby" | "room";
  chatPanelLogic: ChatPanelLogic;
  subLogicList: SubLogicList;
}

export default function ChatPanel(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [chatContent, setChatContent] = React.useState<string>("");
  const handleSend = () => {
    props.chatPanelLogic.send(
      props.globalLogic.getRoomInstance(props.lobbyOrRoom),
      chatContent
    );
    setChatContent("");
  };

  return (
    <div>
      <ChatMessageList
        globalLogic={props.globalLogic}
        chatMessageListLogic={props.subLogicList.chatMessageListLogic}
      />
      <label>
        {i18n.chat_inputLabel(props.lobbyOrRoom)}{" "}
        <input
          accessKey="/"
          type="text"
          maxLength={200}
          value={chatContent}
          onChange={(evt) => {
            setChatContent(evt.target.value);
          }}
          onKeyDown={(evt) => {
            if (evt.ctrlKey && evt.key === "Enter" && chatContent !== "") {
              handleSend();
            }
          }}
        />
      </label>
      <button type="button" disabled={chatContent === ""} onClick={handleSend}>
        {i18n.chat_send()}
      </button>
    </div>
  );
}
