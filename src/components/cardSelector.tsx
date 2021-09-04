import React from "react";
import {
  CardListMessage,
  DiscardPairListMessage,
  encodeCardListMessage,
  encodeDiscardPairListMessage,
  encodeSelectableCardMessage,
  CardMark,
} from "dfg-messages";
import { GlobalLogic } from "../logic/global";
import { CardSelectorLogic } from "../logic/cardSelector";

interface Props {
  globalLogic: GlobalLogic;
  cardSelectorLogic: CardSelectorLogic;
}

export default function CardSelector(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [cardList, setCardList] = React.useState<CardListMessage>(
    encodeCardListMessage([])
  );
  const [discardPairList, setDiscardPairList] =
    React.useState<DiscardPairListMessage>(encodeDiscardPairListMessage([]));
  React.useEffect(() => {
    props.cardSelectorLogic.subscribeCardListUpdate(setCardList);
    props.cardSelectorLogic.subscribeDiscardPairListUpdate(setDiscardPairList);
    return () => {
      props.cardSelectorLogic.unsubscribeCardListUpdate();
      props.cardSelectorLogic.unsubscribeDiscardPairListUpdate();
    };
  }, []);
  return (
    <div>
      <h2>{i18n.cardSelector_heading()}</h2>
      <ul>
        {cardList.cardList.map((v, i) => {
          return (
            <li key={i}>
              <label>
                {i18n.game_card(v.mark, v.cardNumber)}
                <input
                  type="checkbox"
                  checked={v.isChecked}
                  disabled={!v.isCheckable}
                />
              </label>
            </li>
          );
        })}
      </ul>
      <ul>
        {discardPairList.discardPairList.map((v, i) => {
          return (
            <button key={i} type="button">
              {i18n.game_cardList(v.cardList)}
            </button>
          );
        })}
      </ul>
    </div>
  );
}