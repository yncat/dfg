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

export class Result extends Schema {
  @type(["string"]) public daifugoPlayerList: ArraySchema<string> =
    new ArraySchema<string>();
  @type(["string"]) public fugoPlayerList: ArraySchema<string> =
    new ArraySchema<string>();
  @type(["string"]) public heiminPlayerList: ArraySchema<string> =
    new ArraySchema<string>();
  @type(["string"]) public hinminPlayerList: ArraySchema<string> =
    new ArraySchema<string>();
  @type(["string"]) public daihinminPlayerList: ArraySchema<string> =
    new ArraySchema<string>();
}
