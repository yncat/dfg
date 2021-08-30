export interface I18nService{
	connectionStatus_mainServer:()=>string;
	connectionStatus_notConnected:()=>string;
	connectionStatus_connecting:()=>string;
	connectionStatus_connected:(playerCount:number)=>string;
	chat_chatHeading:()=>string;
	chat_lobby:()=>string;
	chat_room:()=>string;
	chat_inputLabel:(lobbyOrLabel:"lobby"|"room")=>string;
	chat_send:()=>string;
	createRoomButton_createRoom:()=>string;
	roomList_creator:()=>string;
	roomList_currentPlayerCount:()=>string;
	roomList_join:()=>string;
}
