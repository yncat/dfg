import { I18nService } from "../i18n/i18n";

export interface GlobalLogic {
	i18n:I18nService;
	subscribeConnectionEvent:(onConnect:(isConnected:boolean)=>void)=>void;
}

export class GlobalLogicImple implements GlobalLogic {
	onConnect:null | ((isConnected:boolean)=>void);
	i18n:I18nService;

	constructor(i18n:I18nService){
		this.onConnect=null;
		this.i18n=i18n;
	}

	public subscribeConnectionEvent(onConnect:(isConnected:boolean)=>void){
		this.onConnect=onConnect;
	}

	public performConnect(){
		setTimeout(()=>{
			if(this.onConnect){
				this.onConnect(true);
			}
		},5000);
	}
}

export function createGlobalLogic(i18n:I18nService):GlobalLogic{
	return new GlobalLogicImple(i18n);
}
