import { CardListMessage, DiscardPairListMessage } from "dfg-messages";
import {
  CardMark,
  encodeCardListMessage,
  encodeSelectableCardMessage,
} from "dfg-messages";

export type CardListUpdateFunc = (message: CardListMessage) => void;
export type DiscardPairListUpdateFunc = (discardPairList: DiscardPairListMessage) => void;

export interface CardSelectorLogic {
  subscribeCardListUpdate: (onUpdate: CardListUpdateFunc) => void;
  unsubscribeCardListUpdate: () => void;
  subscribeDiscardPairListUpdate: (onUpdate: DiscardPairListUpdateFunc) => void;
  unsubscribeDiscardPairListUpdate: ()=>void;
  updateCardList: (message: CardListMessage) => void;
  updateDiscardPairList: (discardPairList: DiscardPairListMessage) => void;
  handleToggleCheck: (index: number) => void;
}

export class CardSelectorLogicImple implements CardSelectorLogic {
  onCardListUpdate: CardListUpdateFunc | null;
  onDiscardPairListUpdate: DiscardPairListUpdateFunc | null;
  constructor() {
    this.onCardListUpdate = null;
    this.onDiscardPairListUpdate = null;
  }

  public subscribeCardListUpdate(onUpdate: CardListUpdateFunc): void {
    this.onCardListUpdate = onUpdate;
  }

  public subscribeDiscardPairListUpdate(onUpdate: DiscardPairListUpdateFunc): void {
    this.onDiscardPairListUpdate = onUpdate;
  }

  public unsubscribeCardListUpdate(): void {
    this.onCardListUpdate = null;
  }

  public unsubscribeDiscardPairListUpdate(): void {
    this.onDiscardPairListUpdate = null;
  }

  public updateCardList(message: CardListMessage): void {
    if (this.onCardListUpdate) {
      this.onCardListUpdate(message);
    }
  }

  public updateDiscardPairList(message: DiscardPairListMessage): void {
    if (this.onDiscardPairListUpdate) {
      this.onDiscardPairListUpdate(message);
    }
  }

  public handleToggleCheck(index: number): void {
    const msg = encodeCardListMessage([
      encodeSelectableCardMessage(CardMark.DIAMONDS, 4, true, true),
    ]);
    this.updateCardList(msg);
  }
}

export function createCardSelectorLogic(): CardSelectorLogic {
  return new CardSelectorLogicImple();
}
