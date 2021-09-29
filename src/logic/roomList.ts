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

export interface RoomListLogic {
  pubsub: Pubsub<RoomListEntry[]>;
  update: (roomListEntryList: RoomListEntry[]) => void;
  fetchLatest: () => RoomListEntry[];
}

export class RoomListLogicImple implements RoomListLogic {
  pubsub: Pubsub<RoomListEntry[]>;
  constructor() {
    this.pubsub = new Pubsub<RoomListEntry[]>();
  }

  public fetchLatest(): RoomListEntry[] {
    const latest = this.pubsub.fetchLatest();
    return Array.from(latest === null ? [] : latest);
  }

  public update(roomListEntryList: RoomListEntry[]): void {
    this.pubsub.publish(Array.from(roomListEntryList));
  }
}

export function createRoomListLogic() {
  return new RoomListLogicImple();
}
