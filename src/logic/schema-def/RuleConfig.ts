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

export class RuleConfig extends Schema {
  @type("boolean") public yagiri!: boolean;
  @type("boolean") public jBack!: boolean;
  @type("boolean") public kakumei!: boolean;
  @type("boolean") public reverse!: boolean;
  @type("uint8") public skip!: number;
  @type("boolean") public transfer!: boolean;
  @type("boolean") public exile!: boolean;
}
