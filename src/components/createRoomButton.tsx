import React from "react";
import { GlobalLogic } from "../logic/global";
import { SoundEvent } from "../logic/sound"

interface Props {
  globalLogic: GlobalLogic;
}

export default function CreateRoomButton(props: Props) {
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  return (
    <button
      type="button"
      disabled={isCreating}
      onClick={() => {
        setIsCreating(true);
        props.globalLogic.createGameRoom((success:boolean)=>{
          setIsCreating(false);
          if(!success){
            props.globalLogic.sound.enqueueEvent(SoundEvent.FORBIDDEN);
          }
        });
      }}
    >
      {isCreating ? props.globalLogic.i18n.createRoomButton_creating() : props.globalLogic.i18n.createRoomButton_createRoom()}
    </button>
  );
}
