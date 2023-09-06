import { I18nService } from "../i18n/interface";
import * as dfgmsg from "dfg-messages";
import { SoundEvent } from "./sound";
import { isDecodeSuccess } from "./decodeValidator";

export type ProcessedEvent = {
  soundEvents: SoundEvent[];
  messages: string[];
};

type ProcessorFunc = (eventBody: string) => ProcessedEvent;

export class EventProcessor {
  i18n: I18nService;
  processorMap: Map<string, ProcessorFunc>;
  constructor(i18n: I18nService) {
    this.i18n = i18n;
    this.processorMap = new Map<string, ProcessorFunc>([
      ["InitialInfoMessage", this.processInitialInfoMessage.bind(this)],
      ["CardsProvidedMessage", this.processCardsProvidedMessage.bind(this)],
      ["TurnMessage", this.processTurnMessage.bind(this)],
      ["DiscardMessage", this.processDiscardMessage.bind(this)],
      ["PassMessage", this.processPassMessage.bind(this)],
      ["NagareMessage", this.processNagareMessage.bind(this)],
      ["KakumeiMessage", this.processKakumeiMessage.bind(this)],
      ["ReverseMessage", this.processReverseMessage.bind(this)],
      ["TurnSkippedMessage", this.processTurnSkippedMessage.bind(this)],
      ["TransferMessage", this.processTransferMessage.bind(this)],
      ["ExileMessage", this.processExileMessage.bind(this)],
      [
        "StrengthInversionMessage",
        this.processStrengthInversionMessage.bind(this),
      ],
      ["AgariMessage", this.processAgariMessage.bind(this)],
      ["ForbiddenAgariMessage", this.processForbiddenAgariMessage.bind(this)],
      [
        "PlayerRankChangedMessage",
        this.processPlayerRankChangedMessage.bind(this),
      ],
    ]);
  }

  public processEvent(eventType: string, eventBody: string): ProcessedEvent {
    const f = this.processorMap.get(eventType);
    if (f === undefined) {
      return this.emptyEvent();
    }
    return f(eventBody);
  }

  private emptyEvent(): ProcessedEvent {
    return { soundEvents: [], messages: [] };
  }

  private processInitialInfoMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.InitialInfoMessage>(
      JSON.parse(eventBody),
      dfgmsg.InitialInfoMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.InitialInfoMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [SoundEvent.START, SoundEvent.SHUFFLE, SoundEvent.GIVE],
      messages: [this.i18n.game_initialInfo(evt.playerCount, evt.deckCount)],
    };
  }

  private processCardsProvidedMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.CardsProvidedMessage>(
      JSON.parse(eventBody),
      dfgmsg.CardsProvidedMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.CardsProvidedMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [],
      messages: [this.i18n.game_cardsProvided(evt.playerName, evt.cardCount)],
    };
  }

  private processTurnMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.TurnMessage>(
      JSON.parse(eventBody),
      dfgmsg.TurnMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.TurnMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [],
      messages: [this.i18n.game_turn(evt.playerName)],
    };
  }

  private processDiscardMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.DiscardMessage>(
      JSON.parse(eventBody),
      dfgmsg.DiscardMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.DiscardMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [SoundEvent.DISCARD],
      messages: [
        this.i18n.game_discard(
          evt.playerName,
          evt.discardPair,
          evt.remainingHandCount
        ),
      ],
    };
  }

  private processPassMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.PassMessage>(
      JSON.parse(eventBody),
      dfgmsg.PassMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.PassMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [SoundEvent.PASS],
      messages: [
        this.i18n.game_passMessage(evt.playerName, evt.remainingHandCount),
      ],
    };
  }

  private processNagareMessage(eventBody: string): ProcessedEvent {
    return {
      soundEvents: [SoundEvent.RESET],
      messages: [this.i18n.game_nagare()],
    };
  }

  private processKakumeiMessage(eventBody: string): ProcessedEvent {
    return {
      soundEvents: [SoundEvent.KAKUMEI],
      messages: [this.i18n.game_kakumei()],
    };
  }

  private processReverseMessage(eventBody: string): ProcessedEvent {
    return {
      soundEvents: [SoundEvent.REVERSE],
      messages: [this.i18n.game_reversed()],
    };
  }

  private processTurnSkippedMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.TurnSkippedMessage>(
      JSON.parse(eventBody),
      dfgmsg.TurnSkippedMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.TurnSkippedMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [SoundEvent.SKIP],
      messages: [this.i18n.game_skipped(evt.playerName)],
    };
  }

  private processTransferMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.TransferMessage>(
      JSON.parse(eventBody),
      dfgmsg.TransferMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.TransferMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [SoundEvent.TRANSFER],
      messages: [
        this.i18n.game_transferred(
          evt.fromPlayerName,
          evt.toPlayerName,
          evt.cardList
        ),
      ],
    };
  }

  private processExileMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.ExileMessage>(
      JSON.parse(eventBody),
      dfgmsg.ExileMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.ExileMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [SoundEvent.DISCARD],
      messages: [this.i18n.game_exiled(evt.playerName, evt.cardList)],
    };
  }

  private processStrengthInversionMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.StrengthInversionMessage>(
      JSON.parse(eventBody),
      dfgmsg.StrengthInversionMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.StrengthInversionMessage>(evt)) {
      return this.emptyEvent();
    }
    const se = evt.isStrengthInverted ? SoundEvent.BACK : SoundEvent.UNBACK;
    return {
      soundEvents: [se],
      messages: [this.i18n.game_strengthInverted(evt.isStrengthInverted)],
    };
  }

  private processAgariMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.AgariMessage>(
      JSON.parse(eventBody),
      dfgmsg.AgariMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.AgariMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [],
      messages: [this.i18n.game_agari(evt.playerName)],
    };
  }

  private processForbiddenAgariMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.ForbiddenAgariMessage>(
      JSON.parse(eventBody),
      dfgmsg.ForbiddenAgariMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.ForbiddenAgariMessage>(evt)) {
      return this.emptyEvent();
    }
    return {
      soundEvents: [SoundEvent.FORBIDDEN],
      messages: [this.i18n.game_forbiddenAgari(evt.playerName)],
    };
  }

  private processPlayerRankChangedMessage(eventBody: string): ProcessedEvent {
    const evt = dfgmsg.decodePayload<dfgmsg.PlayerRankChangedMessage>(
      JSON.parse(eventBody),
      dfgmsg.PlayerRankChangedMessageDecoder
    );
    if (!isDecodeSuccess<dfgmsg.PlayerRankChangedMessage>(evt)) {
      return this.emptyEvent();
    }
    const se = this.selectRankSoundEvent(evt.after);
    if (se === null) {
      return this.emptyEvent();
    }
    const msg =
      evt.before === dfgmsg.RankType.UNDETERMINED
        ? this.i18n.game_ranked(evt.playerName, evt.after)
        : this.i18n.game_rankChanged(evt.playerName, evt.before, evt.after);
    return {
      soundEvents: [se],
      messages: [msg],
    };
  }

  private selectRankSoundEvent(e: dfgmsg.RankType): SoundEvent | null {
    switch (e) {
      case dfgmsg.RankType.DAIFUGO:
        return SoundEvent.DAIFUGO;
      case dfgmsg.RankType.FUGO:
        return SoundEvent.FUGO;
      case dfgmsg.RankType.HEIMIN:
        return SoundEvent.HEIMIN;
      case dfgmsg.RankType.HINMIN:
        return SoundEvent.HINMIN;
      case dfgmsg.RankType.DAIHINMIN:
        return SoundEvent.DAIHINMIN;
    }
    return null;
  }
}
