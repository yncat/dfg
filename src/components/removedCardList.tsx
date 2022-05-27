import React from "react";
import { GlobalLogic } from "../logic/global";
import { RemovedCardEntryDTO } from "../logic/gameState";
import { CardMark } from "dfg-messages";

interface Props {
  globalLogic: GlobalLogic;
  removedCardList: RemovedCardEntryDTO[];
}

export default function RemovedCardEntry(props: Props) {
  const i18n = props.globalLogic.i18n;

  return (
    <div>
      {props.removedCardList.length === 0 ? (
        <p>{i18n.removedCards_description()}</p>
      ) : (
        <ul>
          {props.removedCardList.map((v, i) => {
            return (
              <li key={i}>
                {i18n.removedCardEntry(
                  v.mark as CardMark,
                  v.cardNumber,
                  v.count
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
