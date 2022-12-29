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

export class EventLog extends Schema {
  @type("string") public type!: string;
  @type("string") public body!: string;
}
