import React from "react";
import { GlobalLogic } from "../logic/global";
import { DiscardPairDTO } from "../logic/gameState";
import { encodeCardMessage, CardMark } from "dfg-messages";

interface Props {
  globalLogic: GlobalLogic;
  discardStack: DiscardPairDTO[];
}

export default function GameInfo(props: Props) {
  const i18n = props.globalLogic.i18n;

  return (
    <div>
      {props.discardStack.length === 0 ? (
        <p>{i18n.discardStack_noCards()}</p>
      ) : (
        <ul>
          {props.discardStack.map((v, i) => {
            const cards = v.cards.map((w) => {
              return encodeCardMessage(w.mark as CardMark, w.cardNumber);
            });
            return <li key={i}>{i18n.game_cardList(cards)}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
