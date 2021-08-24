export interface ConnectionStatusI18n {
	mainServer:()=>string;
	notConnected:()=>string;
	connecting:()=>string;
	connected:(playerCount:number)=>string;
}

