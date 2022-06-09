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
  const [joiningIndex, setJoiningIndex] = React.useState<number>(-1); // -1: not joining to any room
  const [entryList, setEntryList] = React.useState<RoomListEntry[]>(
    props.roomListLogic.fetchLatest()
  );
  const genJoinButtonLabel = (v: RoomListEntry, i: number) => {
    if (joiningIndex !== i) {
      return v.state === RoomState.WAITING
        ? i18n.roomList_join()
        : i18n.roomList_watch();
    }
    return i18n.roomList_joining();
  };
  React.useEffect(() => {
    props.roomListLogic.pubsub.subscribe(setEntryList);
    const id = props.globalLogic.roomCreatedPubsub.subscribe(
      (playerName: string) => {
        props.globalLogic.sound.enqueueEvent(SoundEvent.ROOMCREATED);
        props.globalLogic.updateAutoRead(
          props.globalLogic.i18n.lobbyAnnouncement_roomCreated(playerName)
        );
      }
    );
    return () => {
      props.globalLogic.roomCreatedPubsub.unsubscribe(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return entryList.length > 0 ? (
    <table className="room-list-table">
      <thead>
        <tr>
          <th>{i18n.roomList_creator()}</th>
          <th>{i18n.roomList_currentPlayerCount()}</th>
          <th>{i18n.roomList_ruleConfig()}</th>
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
              <td>{i18n.ruleConfig(v.ruleConfig)}</td>
              <td>{i18n.roomList_stateValue(v.state)}</td>
              <td>
                <button
                  type="button"
                  disabled={joiningIndex !== -1}
                  onClick={() => {
                    setJoiningIndex(i);
                    props.globalLogic.joinGameRoomByID(
                      v.roomID,
                      (success: boolean) => {
                        setJoiningIndex(-1);
                        if (!success) {
                          props.globalLogic.sound.enqueueEvent(
                            SoundEvent.FORBIDDEN
                          );
                        }
                      }
                    );
                  }}
                >
                  {genJoinButtonLabel(v, i)}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <p>{i18n.roomList_noRoom()}</p>
  );
}
