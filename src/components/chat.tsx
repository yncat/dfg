import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { GlobalLogic } from "../logic/global";

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
          <h2>Any content 1</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
}
