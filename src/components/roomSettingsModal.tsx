import React from "react";
import { Form } from "react-bootstrap";
import { GlobalLogic } from "../logic/global";
import { SkipConfig } from "dfg-messages";

interface Props {
  globalLogic: GlobalLogic;
  yagiri: boolean;
  jBack: boolean;
  kakumei: boolean;
  reverse: boolean;
  skip: SkipConfig;
  onYagiriChange: (yagiri: boolean) => void;
  onJBackChange: (jBack: boolean) => void;
  onKakumeiChange: (kakumei: boolean) => void;
  onReverseChange: (reverse: boolean) => void;
  onSkipChange: (skip: SkipConfig) => void;
}

export default function RoomSettingsModal(props: Props) {
  const i18n = props.globalLogic.i18n;
  const skipConfigMap: Map<string, SkipConfig> = new Map<string, SkipConfig>([
    ["OFF", SkipConfig.OFF],
    ["SINGLE", SkipConfig.SINGLE],
    ["MULTI", SkipConfig.MULTI],
  ]);
  // TypeScript wouldn't detect type here. Don't know why.
  const handleSkipRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const c = skipConfigMap.get(e.currentTarget.value);
    if (c === undefined) {
      return;
    }
    props.onSkipChange(c);
  };
  return (
    <React.Fragment>
      <h2>{i18n.roomSettings_ruleSettingsHeading()}</h2>
      <Form>
        <Form.Group className="mb-3" controlId="roomSettings_yagiri">
          <Form.Check
            type="checkbox"
            label={i18n.roomSettings_yagiri()}
            checked={props.yagiri}
            onChange={() => {
              props.onYagiriChange(!props.yagiri);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_jBack">
          <Form.Check
            type="checkbox"
            label={i18n.roomSettings_jBack()}
            checked={props.jBack}
            onChange={() => {
              props.onJBackChange(!props.jBack);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_kakumei">
          <Form.Check
            type="checkbox"
            label={i18n.roomSettings_kakumei()}
            checked={props.kakumei}
            onChange={() => {
              props.onKakumeiChange(!props.kakumei);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_reverse">
          <Form.Check
            type="checkbox"
            label={i18n.roomSettings_reverse()}
            checked={props.reverse}
            onChange={() => {
              props.onReverseChange(!props.reverse);
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roomSettings_skip">
          <div role="group" aria-labelledby="skip_label">
            <Form.Label id="skip_label">{i18n.roomSettings_skip()}</Form.Label>
            <Form.Check
              id="roomSettings_skip_off"
              type="radio"
              name="skip"
              value="OFF"
              checked={props.skip === SkipConfig.OFF}
              onChange={handleSkipRadio}
              label={i18n.roomSettings_skip_off()}
            />
            <Form.Check
              id="roomSettings_skip_single"
              type="radio"
              name="skip"
              value="SINGLE"
              checked={props.skip === SkipConfig.SINGLE}
              label={i18n.roomSettings_skip_single()}
              onChange={handleSkipRadio}
            />
            <Form.Check
              id="roomSettings_skip_multi"
              type="radio"
              name="skip"
              value="MULTI"
              checked={props.skip === SkipConfig.MULTI}
              label={i18n.roomSettings_skip_multiple()}
              onChange={handleSkipRadio}
            />
          </div>
        </Form.Group>
      </Form>
    </React.Fragment>
  );
}
