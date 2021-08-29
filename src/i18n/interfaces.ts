export interface ConnectionStatusI18n {
	mainServer:()=>string;
	notConnected:()=>string;
	connecting:()=>string;
	connected:(playerCount:number)=>string;
}

export interface CreateRoomButtonI18n {
	createRoom:()=>string;
}

export interface RoomListI18n {
	creator:()=>string;
	currentPlayerCount:()=>string;
	join:()=>string;
}

export interface ChatI18n {
	chatHeading:()=>string;
	lobby:()=>string;
	room:()=>string;
	inputLabel:(lobbyOrRoom:'lobby'|'room')=>string;
	send:()=>string;
}	
