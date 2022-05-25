import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { GlobalLogic } from "../logic/global";
import { GameStateDTO } from "../logic/gameState";
import Log from "./log";

interface Props {
  globalLogic: GlobalLogic;
  gameState: GameStateDTO;
  logContents: string[];
}

export default function PlayingInfoPanel(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [selectedTab, setSelectedTab] = React.useState<number>(0);

  return (
    <div>
      <h2>{i18n.playingInfo_heading()}</h2>
      <Tabs
        selectedIndex={selectedTab}
        onSelect={(index) => setSelectedTab(index)}
      >
        <TabList>
          <Tab>{i18n.playingInfo_log()}</Tab>
          <Tab>{i18n.playingInfo_discardStack()}</Tab>
          <Tab>{i18n.playingInfo_removedCardList()}</Tab>
        </TabList>
        <TabPanel>
          <Log globalLogic={props.globalLogic} contents={props.logContents} />
        </TabPanel>
        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
      </Tabs>
    </div>
  );
}
