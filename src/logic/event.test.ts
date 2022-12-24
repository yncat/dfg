import { EventProcessor } from "./event";
import { createI18nService } from "../i18n/i18n";
import * as dfgmsg from "dfg-messages";
import { SoundEvent } from "./sound";

describe("EventProcessor", () => {
  describe("InitialInfoMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "InitialInfoMessage",
        JSON.stringify(dfgmsg.encodeInitialInfoMessage(3, 1))
      );
      expect(ret.soundEvents).toStrictEqual([]);
      expect(ret.messages).toStrictEqual([i18n.game_initialInfo(3, 1)]);
    });
  });

  describe("CardsProvidedMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "CardsProvidedMessage",
        JSON.stringify(dfgmsg.encodeCardsProvidedMessage("cat", 10))
      );
      expect(ret.soundEvents).toStrictEqual([]);
      expect(ret.messages).toStrictEqual([i18n.game_cardsProvided("cat", 10)]);
    });
  });

  describe("TurnMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "TurnMessage",
        JSON.stringify(dfgmsg.encodeTurnMessage("cat"))
      );
      expect(ret.soundEvents).toStrictEqual([]);
      expect(ret.messages).toStrictEqual([i18n.game_turn("cat")]);
    });
  });

  describe("DiscardMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const cdmsg = dfgmsg.encodeCardMessage(dfgmsg.CardMark.DIAMONDS, 3);
      const dpmsg = dfgmsg.encodeDiscardPairMessage([cdmsg]);
      const ret = ep.processEvent(
        "DiscardMessage",
        JSON.stringify(dfgmsg.encodeDiscardMessage("cat", dpmsg, 3))
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.DISCARD]);
      expect(ret.messages).toStrictEqual([i18n.game_discard("cat", dpmsg, 3)]);
    });
  });

  describe("PassMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "PassMessage",
        JSON.stringify(dfgmsg.encodePassMessage("cat", 4))
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.PASS]);
      expect(ret.messages).toStrictEqual([i18n.game_passMessage("cat", 4)]);
    });
  });

  describe("NagareMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent("NagareMessage", "");
      expect(ret.soundEvents).toStrictEqual([SoundEvent.RESET]);
      expect(ret.messages).toStrictEqual([i18n.game_nagare()]);
    });
  });

  describe("KakumeiMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent("KakumeiMessage", "");
      expect(ret.soundEvents).toStrictEqual([SoundEvent.KAKUMEI]);
      expect(ret.messages).toStrictEqual([i18n.game_kakumei()]);
    });
  });

  describe("ReverseMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent("ReverseMessage", "");
      expect(ret.soundEvents).toStrictEqual([SoundEvent.REVERSE]);
      expect(ret.messages).toStrictEqual([i18n.game_reversed()]);
    });
  });

  describe("TurnSkippedMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "TurnSkippedMessage",
        JSON.stringify(dfgmsg.encodeTurnSkippedMessage("cat"))
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.SKIP]);
      expect(ret.messages).toStrictEqual([i18n.game_skipped("cat")]);
    });
  });

  describe("StrengthInversionMessage", () => {
    it("processes inverted event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "StrengthInversionMessage",
        JSON.stringify(dfgmsg.encodeStrengthInversionMessage(true))
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.BACK]);
      expect(ret.messages).toStrictEqual([i18n.game_strengthInverted(true)]);
    });

    it("processes not inverted event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "StrengthInversionMessage",
        JSON.stringify(dfgmsg.encodeStrengthInversionMessage(false))
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.UNBACK]);
      expect(ret.messages).toStrictEqual([i18n.game_strengthInverted(false)]);
    });
  });

  describe("AgariMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "AgariMessage",
        JSON.stringify(dfgmsg.encodeAgariMessage("cat"))
      );
      expect(ret.soundEvents).toStrictEqual([]);
      expect(ret.messages).toStrictEqual([i18n.game_agari("cat")]);
    });
  });

  describe("ForbiddenAgariMessage", () => {
    it("processes event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "ForbiddenAgariMessage",
        JSON.stringify(dfgmsg.encodeForbiddenAgariMessage("cat"))
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.FORBIDDEN]);
      expect(ret.messages).toStrictEqual([i18n.game_forbiddenAgari("cat")]);
    });
  });

  describe("PlayerRankChangedMessage", () => {
    it("processes daifugo event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "PlayerRankChangedMessage",
        JSON.stringify(
          dfgmsg.encodePlayerRankChangedMessage(
            "cat",
            dfgmsg.RankType.UNDETERMINED,
            dfgmsg.RankType.DAIFUGO
          )
        )
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.DAIFUGO]);
      expect(ret.messages).toStrictEqual([
        i18n.game_rankChanged(
          "cat",
          dfgmsg.RankType.UNDETERMINED,
          dfgmsg.RankType.DAIFUGO
        ),
      ]);
    });

    it("processes fugo event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "PlayerRankChangedMessage",
        JSON.stringify(
          dfgmsg.encodePlayerRankChangedMessage(
            "cat",
            dfgmsg.RankType.UNDETERMINED,
            dfgmsg.RankType.FUGO
          )
        )
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.FUGO]);
      expect(ret.messages).toStrictEqual([
        i18n.game_rankChanged(
          "cat",
          dfgmsg.RankType.UNDETERMINED,
          dfgmsg.RankType.FUGO
        ),
      ]);
    });

    it("processes heimin event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "PlayerRankChangedMessage",
        JSON.stringify(
          dfgmsg.encodePlayerRankChangedMessage(
            "cat",
            dfgmsg.RankType.UNDETERMINED,
            dfgmsg.RankType.HEIMIN
          )
        )
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.HEIMIN]);
      expect(ret.messages).toStrictEqual([
        i18n.game_rankChanged(
          "cat",
          dfgmsg.RankType.UNDETERMINED,
          dfgmsg.RankType.HEIMIN
        ),
      ]);
    });

    it("processes hinmin event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "PlayerRankChangedMessage",
        JSON.stringify(
          dfgmsg.encodePlayerRankChangedMessage(
            "cat",
            dfgmsg.RankType.UNDETERMINED,
            dfgmsg.RankType.HINMIN
          )
        )
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.HINMIN]);
      expect(ret.messages).toStrictEqual([
        i18n.game_rankChanged(
          "cat",
          dfgmsg.RankType.UNDETERMINED,
          dfgmsg.RankType.HINMIN
        ),
      ]);
    });

    it("processes daihinmin event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent(
        "PlayerRankChangedMessage",
        JSON.stringify(
          dfgmsg.encodePlayerRankChangedMessage(
            "cat",
            dfgmsg.RankType.UNDETERMINED,
            dfgmsg.RankType.DAIHINMIN
          )
        )
      );
      expect(ret.soundEvents).toStrictEqual([SoundEvent.DAIHINMIN]);
      expect(ret.messages).toStrictEqual([
        i18n.game_rankChanged(
          "cat",
          dfgmsg.RankType.UNDETERMINED,
          dfgmsg.RankType.DAIHINMIN
        ),
      ]);
    });
  });

  describe("unrecognized event", () => {
    it("returns empty event", () => {
      const i18n = createI18nService("Japanese");
      const ep = new EventProcessor(i18n);
      const ret = ep.processEvent("UnrecognizedMessage", "");
      expect(ret.soundEvents).toStrictEqual([]);
      expect(ret.messages).toStrictEqual([]);
    });
  });
});
