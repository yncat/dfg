import React from "react";
import { Form } from "react-bootstrap";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
}

export default function RoomSettingsModal(props: Props) {
  const i18n = props.globalLogic.i18n;
  return (
    <React.Fragment>
      <h2>{i18n.roomSettings_ruleSettingsHeading()}</h2>
      <Form>
        <Form.Group className="mb-3" controlId="roomSettings_yagiri">
          <Form.Check type="checkbox" label={i18n.roomSettings_yagiri()} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_jBack">
          <Form.Check type="checkbox" label={i18n.roomSettings_jBack()} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_kakumei">
          <Form.Check type="checkbox" label={i18n.roomSettings_kakumei()} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_reverse">
          <Form.Check type="checkbox" label={i18n.roomSettings_reverse()} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_skip">
          <div role="group" aria-labelledby="skip_label">
            <Form.Label id="skip_label">{i18n.roomSettings_skip()}</Form.Label>
            <Form.Check
              type="radio"
              id="skip_off"
              name="skip"
              label={i18n.roomSettings_skip_off()}
            />
            <Form.Check
              type="radio"
              id="skip_single"
              name="skip"
              label={i18n.roomSettings_skip_single()}
            />
            <Form.Check
              type="radio"
              id="skip_multiple"
              name="skip"
              label={i18n.roomSettings_skip_multiple()}
            />
          </div>
        </Form.Group>
      </Form>
    </React.Fragment>
  );
}
