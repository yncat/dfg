import { isConstructorDeclaration } from "typescript"

export type AutoReadUpdateFunc=(updateString:string)=>void;

export interface AutoReadLogic {
	subscribe:(onUpdate:AutoReadUpdateFunc)=>void;
	unsubscribe:()=>void;
	enqueue:(enqueueString:string)=>void;
}

class AutoReadLogicImple implements AutoReadLogic{
	onUpdate:AutoReadUpdateFunc|null;
	constructor(){
		this.onUpdate=null;
	}

	public subscribe(onUpdate:AutoReadUpdateFunc):void{
		this.onUpdate=onUpdate;
	}

	public unsubscribe(){
		this.onUpdate=null;
	}

	public enqueue(enqueueString:string){
		this.update(enqueueString);
	}

	private update(updateString:string){
		if(this.onUpdate){
			this.onUpdate(updateString);
		}
	}
}

export function createAutoReadLogic():AutoReadLogic{
	return new AutoReadLogicImple();
}