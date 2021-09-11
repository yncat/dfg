import { Pubsub } from "./pubsub";
import { RoomState } from "dfg-messages";

export type RoomListEntry = {
  creator: string;
  currentPlayerCount: number;
  state: RoomState;
  roomID: string;
};

export function createRoomListEntry(
  creator: string,
  currentPlayerCount: number,
  state: RoomState,
  roomID: string
): RoomListEntry {
  return { creator, currentPlayerCount, state, roomID };
}

export type RoomListUpdatePipelineFunc = (roomList: RoomListEntry[]) => void;
export type RoomListSubscriber = (roomList: RoomListEntry[]) => void;

export interface RoomListLogic {
  pubsub: Pubsub<RoomListSubscriber>;
  update: (roomListEntryList: RoomListEntry[]) => void;
  fetchLatest: () => RoomListEntry[];
}

export class RoomListLogicImple implements RoomListLogic {
  latest: RoomListEntry[];
  pubsub: Pubsub<RoomListSubscriber>;
  constructor() {
    this.latest = [];
    this.pubsub = new Pubsub<RoomListSubscriber>();
  }

  public fetchLatest(): RoomListEntry[] {
    return Array.from(this.latest);
  }

  public update(roomListEntryList: RoomListEntry[]): void {
    this.latest = roomListEntryList;
    this.pubsub.publish(Array.from(roomListEntryList));
  }
}

export function createRoomListLogic() {
  return new RoomListLogicImple();
}
