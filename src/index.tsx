import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalLogic } from "./logic/global";
import { createRoomListLogic } from './logic/roomList';
import { createChatMessageListLogic } from "./logic/chatMessageList";
import { createI18nService } from "./i18n/i18n";

const defaultI18nService = createI18nService("Japanese");
const globalLogic = createGlobalLogic(defaultI18nService);
const roomListLogic = createRoomListLogic();
const lobbyChatMessageListLogic = createChatMessageListLogic();
const roomChatMessageListLogic = createChatMessageListLogic();
const subLogicList = {roomListLogic, lobbyChatMessageListLogic, roomChatMessageListLogic};

ReactDOM.render(
  <React.StrictMode>
    <App globalLogic={globalLogic} subLogicList={subLogicList} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
