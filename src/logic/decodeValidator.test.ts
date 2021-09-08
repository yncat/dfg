import { isDecodeSuccess } from "./decodeValidator";
import * as dfgmsg from "dfg-messages";

describe("DecodeValidator", () => {
  it("returns true when payload is successfully decoded", () => {
    const encoded = dfgmsg.encodeChatRequest("test");
    const decoded = dfgmsg.decodePayload<dfgmsg.ChatRequest>(
      encoded,
      dfgmsg.ChatRequestDecoder
    );
    expect(isDecodeSuccess<dfgmsg.ChatRequest>(decoded)).toBeTruthy();
  });

  it("returns false when payload is invalid", () => {
    const encoded = { invalid: true };
    const decoded = dfgmsg.decodePayload<dfgmsg.ChatRequest>(
      encoded,
      dfgmsg.ChatRequestDecoder
    );
    expect(isDecodeSuccess<dfgmsg.ChatRequest>(decoded)).toBeFalsy();
  });
});
