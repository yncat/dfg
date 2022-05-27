//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.26
//

import {
  Schema,
  type,
  ArraySchema,
  MapSchema,
  SetSchema,
  DataChange,
} from "@colyseus/schema";
import { Result } from "./Result";
import { DiscardPair } from "./DiscardPair";
import { RemovedCardEntry } from "./RemovedCardEntry";

export class GameState extends Schema {
  @type("number") public playerCount!: number;
  @type(["string"]) public playerNameList: ArraySchema<string> =
    new ArraySchema<string>();
  @type("string") public ownerPlayerName!: string;
  @type("boolean") public isInGame!: boolean;
  @type(Result) public lastGameResult: Result = new Result();
  @type(Result) public currentGameResult: Result = new Result();
  @type([DiscardPair]) public discardStack: ArraySchema<DiscardPair> =
    new ArraySchema<DiscardPair>();
  @type([RemovedCardEntry])
  public removedCardList: ArraySchema<RemovedCardEntry> = new ArraySchema<RemovedCardEntry>();
}
