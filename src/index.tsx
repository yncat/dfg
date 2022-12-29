import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Config } from "./logic/config";
import { createGlobalLogic } from "./logic/global";
import { createSoundLogic } from "./logic/sound";
import { createRoomListLogic } from "./logic/roomList";
import { createChatMessageListLogic } from "./logic/chatMessageList";
import { createChatPanelLogic } from "./logic/chatPanel";
import { createI18nService } from "./i18n/i18n";
import { createAutoReadLogic } from "./logic/autoRead";
import { createGameLogic } from "./logic/game";
import { createReconnection } from "./logic/reconnection";

const config = new Config(process.env.REACT_APP_SERVER_ADDRESS);
const defaultI18nService = createI18nService("Japanese");
const soundLogic = createSoundLogic();
const reconnection = createReconnection();
const globalLogic = createGlobalLogic(
  defaultI18nService,
  soundLogic,
  config,
  reconnection
);
globalLogic.registeredPlayerName = "";
const roomListLogic = createRoomListLogic();
const lobbyChatMessageListLogic = createChatMessageListLogic();
const lobbyChatPanelLogic = createChatPanelLogic();
const roomChatMessageListLogic = createChatMessageListLogic();
const roomChatPanelLogic = createChatPanelLogic();
const gameLogic = createGameLogic(defaultI18nService);
globalLogic.roomRegistrationPipeline.register(
  gameLogic.registerRoom.bind(gameLogic)
);
globalLogic.lobbyChatMessagePipeline.register(
  lobbyChatMessageListLogic.push.bind(lobbyChatMessageListLogic)
);
globalLogic.roomChatMessagePipeline.register(
  roomChatMessageListLogic.push.bind(roomChatMessageListLogic)
);
globalLogic.roomListUpdatePipeline.register(
  roomListLogic.update.bind(roomListLogic)
);
const autoReadLogic = createAutoReadLogic();
globalLogic.autoReadPubsub.subscribe(autoReadLogic.enqueue.bind(autoReadLogic));

const subLogicList = {
  roomListLogic,
  lobbyChatMessageListLogic,
  lobbyChatPanelLogic,
  roomChatMessageListLogic,
  roomChatPanelLogic,
  autoReadLogic,
  gameLogic,
};

ReactDOM.render(
  <React.StrictMode>
    <App globalLogic={globalLogic} subLogicList={subLogicList} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
