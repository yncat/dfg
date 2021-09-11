import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { GlobalLogic } from "../logic/global";
import { ChatMessageListLogic } from "../logic/chatMessageList";
import { ChatPanelLogic } from "../logic/chatPanel";
import ChatPanel from "./chatPanel";

interface SubLogicList {
  lobbyChatMessageListLogic: ChatMessageListLogic;
  lobbyChatPanelLogic: ChatPanelLogic;
  roomChatMessageListLogic: ChatMessageListLogic;
  roomChatPanelLogic: ChatPanelLogic;
}

interface Props {
  globalLogic: GlobalLogic;
  subLogicList: SubLogicList;
  isInRoom: boolean;
}

export default function Chat(props: Props) {
  const i18n = props.globalLogic.i18n;
  const lobbySubs = {
    chatMessageListLogic: props.subLogicList.lobbyChatMessageListLogic,
  };
  const roomSubs = {
    chatMessageListLogic: props.subLogicList.roomChatMessageListLogic,
  };
  const [selectedTab, setSelectedTab] = React.useState<number>(0);

  // change tab focus based on room join / leave event
  React.useEffect(() => {
    const id = props.globalLogic.isInRoomPubsub.subscribe(
      (isInRoom: boolean) => {
        if (isInRoom) {
          setSelectedTab(1);
        } else {
          setSelectedTab(0);
        }
      }
    );
    return () => {
      props.globalLogic.isInRoomPubsub.unsubscribe(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h2>{i18n.chat_chatHeading()}</h2>
      <Tabs
        selectedIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      >
        <TabList>
          <Tab>{i18n.chat_lobby()}</Tab>
          <Tab disabled={!props.isInRoom}>{i18n.chat_room()}</Tab>
        </TabList>
        <TabPanel>
          <ChatPanel
            globalLogic={props.globalLogic}
            chatPanelLogic={props.subLogicList.lobbyChatPanelLogic}
            lobbyOrRoom="lobby"
            subLogicList={lobbySubs}
          />
        </TabPanel>
        <TabPanel>
          <ChatPanel
            globalLogic={props.globalLogic}
            chatPanelLogic={props.subLogicList.roomChatPanelLogic}
            lobbyOrRoom="room"
            subLogicList={roomSubs}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
