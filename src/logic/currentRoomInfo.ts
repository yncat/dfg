export type RoomState="waiting"|"playing";

export interface Result{
	daifugoPlayerList:string[];
	fugoPlayerList:string[];
	heiminPlayerList:string[];
	hinminPlayerList:string[];
	daihinminPlayerList:string[];
}

export interface CurrentRoomInfo{
	creator:string;
	playerCount:number;
	memberList:string[];
	state:RoomState;
	currentResult:Result;
	lastResult:Result;
}

export type UpdateFunc=(updatedInfo:CurrentRoomInfo)=>void;

export interface CurrentRoomInfoLogic{
	fetchLatest:()=>CurrentRoomInfo;
}

class CurrentRoomInfoLogicImple implements CurrentRoomInfoLogic{
	fetchLatest():CurrentRoomInfo{
		const lr = {
			daifugoPlayerList: ["cat"],
			fugoPlayerList: ["rabbit"],
			heiminPlayerList:["tiger","lion"],
			hinminPlayerList:["dog"],
			daihinminPlayerList:["monkey"],
		}
		const cr = {
			daifugoPlayerList:["cat"],
			fugoPlayerList:["dog"],
			heiminPlayerList:[],
			hinminPlayerList:[],
			daihinminPlayerList:[],
		}
		return {
			creator: "cat",
			playerCount:6,
			memberList: ["cat", "dog", "rabbit", "lion", "tiger", "monkey"],
			state:"waiting",
			lastResult:lr,
			currentResult:cr,
		}
	}
}

export function createCurrentRoomInfoLogic():CurrentRoomInfoLogic{
	return new CurrentRoomInfoLogicImple();
}
