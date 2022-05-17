/* eslint-disable jsx-a11y/no-access-key */

import React from "react";
import { CardListMessage, DiscardPairListMessage } from "dfg-messages";
import { GlobalLogic } from "../logic/global";

interface Props {
  globalLogic: GlobalLogic;
  cardList: CardListMessage;
  discardPairList: DiscardPairListMessage;
  onCardSelectionChange: (index: number) => void;
  onDiscard: (index: number) => void;
  onPass: () => void;
  isPassable: boolean;
}

export default function CardSelector(props: Props) {
  const i18n = props.globalLogic.i18n;
  const foundChecked =
    props.cardList.cardList.filter((v) => {
      return v.isChecked;
    }).length > 0;

  return (
    <div>
      <h2>{i18n.cardSelector_heading()}</h2>
      <ul>
        {props.cardList.cardList.map((v, i) => {
          return (
            <li key={v.ID}>
              <label>
                <input
                  type="checkbox"
                  checked={v.isChecked}
                  disabled={!v.isCheckable}
                  onClick={(evt) => {
                    props.onCardSelectionChange(i);
                    evt.preventDefault();
                  }}
                />
                {i18n.game_card(v.mark, v.cardNumber)}
              </label>
            </li>
          );
        })}
      </ul>
      <ul>
        {props.discardPairList.discardPairList.map((v, i) => {
          return (
            <button
              key={i}
              type="button"
              onClick={(evt) => {
                props.onDiscard(i);
              }}
            >
              {i18n.game_cardList(v.cardList)}
            </button>
          );
        })}
      </ul>
      {props.isPassable ? (
        <button
          accessKey="p"
          type="button"
          disabled={foundChecked}
          onClick={(e) => {
            props.onPass();
          }}
        >
          {i18n.game_pass()}
        </button>
      ) : null}
    </div>
  );
}
