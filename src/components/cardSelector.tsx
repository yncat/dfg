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
  return (
    <div>
      <h2>{i18n.cardSelector_heading()}</h2>
      <ul>
        {props.cardList.cardList.map((v, i) => {
          return (
            <li key={i}>
              <label>
                {i18n.game_card(v.mark, v.cardNumber)}
                <input
                  type="checkbox"
                  checked={v.isChecked}
                  disabled={!v.isCheckable}
                  onClick={(evt) => {
                    props.onCardSelectionChange(i);
                    evt.preventDefault();
                  }}
                />
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
      <button
        type="button"
        onClick={(e) => {
          props.onPass();
        }}
        disabled={!props.isPassable}
      >
        {i18n.game_pass()}
      </button>
    </div>
  );
}
