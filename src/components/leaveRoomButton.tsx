import React from "react";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
  onLeave: () => void;
}

export default function LeaveRoomButton(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  return (
    <React.Fragment>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={(evt) => {
          setIsExpanded((prev: boolean) => {
            return !prev;
          });
        }}
      >
        {isExpanded ? i18n.leaveRoomButton_cancel() : i18n.currentRoom_leave()}
      </button>
      {isExpanded ? (
        <React.Fragment>
          <p>{i18n.leaveRoomButton_confirmLeaving()}</p>
          <button
            type="button"
            onClick={(e) => {
              props.onLeave();
            }}
          >
            {i18n.currentRoom_leave()}
          </button>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}
