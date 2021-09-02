export type RoomListEntry = {
  creator: string;
  currentPlayerCount: number;
  roomID: string;
};

export interface RoomListLogic {
  update: (roomListEntryList: RoomListEntry[]) => void;
  fetchLatest: () => RoomListEntry[];
}

export class RoomListLogicImple implements RoomListLogic {
  latest: RoomListEntry[];
  constructor() {
    this.latest = [{ roomID: "id1", creator: "cat", currentPlayerCount: 4 }];
  }
  public fetchLatest(): RoomListEntry[] {
    return this.latest;
  }

  public update(roomListEntryList: RoomListEntry[]): void {
    this.latest = roomListEntryList;
  }
}

export function createRoomListLogic() {
  return new RoomListLogicImple();
}
