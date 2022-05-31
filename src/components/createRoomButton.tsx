import React from "react";
import { Button, Modal } from "react-bootstrap";
import RoomSettingsModal from "./roomSettingsModal";
import { GlobalLogic } from "../logic/global";
import { SoundEvent } from "../logic/sound";

interface Props {
  globalLogic: GlobalLogic;
}

export default function CreateRoomButton(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const handleCreateRoom = () => {
    setIsCreating(true);
    props.globalLogic.createGameRoom((success: boolean) => {
      setIsCreating(false);
      if (!success) {
        props.globalLogic.sound.enqueueEvent(SoundEvent.FORBIDDEN);
      }
    });
  };

  return (
    <React.Fragment>
      <button
        type="button"
        disabled={isCreating}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {isCreating
          ? i18n.createRoomButton_creating()
          : props.globalLogic.i18n.createRoomButton_createRoom()}
      </button>
      <Modal
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>{i18n.roomSettings_title()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoomSettingsModal globalLogic={props.globalLogic} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateRoom}>
            {i18n.roomSettings_create()}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            {i18n.roomSettings_cancel()}
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
