import { CardListMessage } from "dfg-messages";
import {
  CardMark,
  encodeCardListMessage,
  encodeSelectableCardMessage,
} from "dfg-messages";

export type UpdateFunc = (message: CardListMessage) => void;

export interface CardSelectorLogic {
  subscribe: (onUpdate: UpdateFunc) => void;
  unsubscribe: () => void;
  update: (message: CardListMessage) => void;
  handleToggleCheck: (index: number) => void;
}

export class CardSelectorLogicImple implements CardSelectorLogic {
  onUpdate: UpdateFunc | null;
  constructor() {
    this.onUpdate = null;
  }

  public subscribe(onUpdate: UpdateFunc): void {
    this.onUpdate = onUpdate;
  }

  public unsubscribe(): void {
    this.onUpdate = null;
  }

  public update(message: CardListMessage): void {
    if (this.onUpdate) {
      this.onUpdate(message);
    }
  }

  public handleToggleCheck(index: number): void {
    const msg = encodeCardListMessage([
      encodeSelectableCardMessage(CardMark.DIAMONDS, 4, true, true),
    ]);
    this.update(msg);
  }
}

export function createCardSelectorLogic(): CardSelectorLogic {
  return new CardSelectorLogicImple();
}
