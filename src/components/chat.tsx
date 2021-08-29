import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { GlobalLogic } from "../logic/global";
import { ChatMessageListLogic } from "../logic/chatMessageList";
import ChatPanel from "./chatPanel";

interface SubLogicList{
  lobbyChatMessageListLogic:ChatMessageListLogic;
  roomChatMessageListLogic:ChatMessageListLogic;
}

interface Props{
  globalLogic:GlobalLogic;
  subLogicList:SubLogicList;
}

export default function Chat(props:Props) {
  const i18n = props.globalLogic.i18n.chat;
  const lobbySubs = {chatMessageListLogic: props.subLogicList.lobbyChatMessageListLogic};
  const roomSubs = {chatMessageListLogic: props.subLogicList.roomChatMessageListLogic};
  return (
    <div>
      <h2>{i18n.chatHeading()}</h2>
      <Tabs>
        <TabList>
          <Tab>{i18n.lobby()}</Tab>
          <Tab>{i18n.room()}</Tab>
        </TabList>
        <TabPanel>
          <ChatPanel globalLogic={props.globalLogic} lobbyOrRoom="lobby" subLogicList={lobbySubs}/>
        </TabPanel>
        <TabPanel>
          <ChatPanel globalLogic={props.globalLogic} lobbyOrRoom="room" subLogicList={roomSubs}/>
        </TabPanel>
      </Tabs>
    </div>
  );
}
