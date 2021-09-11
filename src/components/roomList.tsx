import React from "react";
import { GlobalLogic } from "../logic/global";
import { RoomListLogic, RoomListEntry } from "../logic/roomList";
import { SoundEvent } from "../logic/sound";
import { RoomState } from "dfg-messages";
import "./roomList.css";

interface Props {
  globalLogic: GlobalLogic;
  roomListLogic: RoomListLogic;
}

export default function RoomList(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [entryList, setEntryList] = React.useState<RoomListEntry[]>(
    props.roomListLogic.fetchLatest()
  );
  React.useEffect(() => {
    props.roomListLogic.pubsub.subscribe(setEntryList);
    props.globalLogic.roomCreatedPubsub.subscribe((playerName: string) => {
      props.globalLogic.sound.enqueueEvent(SoundEvent.ROOMCREATED);
      props.globalLogic.updateAutoRead(
        props.globalLogic.i18n.lobbyAnnouncement_roomCreated(playerName)
      );
    });
  });
  return (
    <table className="room-list-table">
      <thead>
        <tr>
          <th>{i18n.roomList_creator()}</th>
          <th>{i18n.roomList_currentPlayerCount()}</th>
          <th>{i18n.roomList_state()}</th>
          <th>{i18n.roomList_action()}</th>
        </tr>
      </thead>
      <tbody>
        {entryList.map((v, i) => {
          return (
            <tr key={i}>
              <td>{v.creator}</td>
              <td>{v.currentPlayerCount}</td>
              <td>{i18n.roomList_stateValue(v.state)}</td>
              <td>
                <button type="button">
                  {v.state === RoomState.WAITING
                    ? i18n.roomList_join()
                    : i18n.roomList_watch()}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
