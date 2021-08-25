export interface ConnectionStatusI18n {
	mainServer:()=>string;
	notConnected:()=>string;
	connecting:()=>string;
	connected:(playerCount:number)=>string;
}
export interface CreateRoomButtonI18n {
	createRoom:()=>string;
}


