import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { GlobalLogic } from "../logic/global";
import ChatPanel from "./chatPanel";

interface Props{
  globalLogic:GlobalLogic;
}

export default function Chat(props:Props) {
  const i18n = props.globalLogic.i18n.chat;
  return (
    <div>
      <h2>{i18n.chatHeading()}</h2>
      <Tabs>
        <TabList>
          <Tab>{i18n.lobby()}</Tab>
          <Tab>{i18n.room()}</Tab>
        </TabList>
        <TabPanel>
          <ChatPanel globalLogic={props.globalLogic} lobbyOrRoom="lobby" />
        </TabPanel>
        <TabPanel>
          <ChatPanel globalLogic={props.globalLogic} lobbyOrRoom="room" />
        </TabPanel>
      </Tabs>
    </div>
  );
}
