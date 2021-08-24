export interface ConnectionStatusI18n {
	notConnected:()=>string;
	connecting:()=>string;
	connected:(playerCount:number)=>string;
}

