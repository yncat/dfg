import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createGlobalLogic } from "./logic/global";
import { createSoundLogic } from "./logic/sound";
import { createRoomListLogic } from "./logic/roomList";
import { createChatMessageListLogic } from "./logic/chatMessageList";
import { createI18nService } from "./i18n/i18n";
import { createAutoReadLogic } from "./logic/autoRead";
import { createCurrentRoomInfoLogic } from "./logic/currentRoomInfo";

const defaultI18nService = createI18nService("Japanese");
const soundLogic = createSoundLogic();
const globalLogic = createGlobalLogic(defaultI18nService, soundLogic);
const roomListLogic = createRoomListLogic();
const lobbyChatMessageListLogic = createChatMessageListLogic();
const roomChatMessageListLogic = createChatMessageListLogic();
const autoReadLogic = createAutoReadLogic();
globalLogic.setAutoReadUpdateFunc(autoReadLogic.enqueue.bind(autoReadLogic));
const currentRoomInfoLogic = createCurrentRoomInfoLogic();

const subLogicList = {
  roomListLogic,
  lobbyChatMessageListLogic,
  roomChatMessageListLogic,
  autoReadLogic,
  currentRoomInfoLogic,
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
