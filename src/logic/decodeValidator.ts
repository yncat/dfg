import { PayloadDecodeError } from "dfg-messages";

export function isDecodeSuccess<T>(
  decoded: T | PayloadDecodeError
): decoded is T {
  return !(decoded instanceof PayloadDecodeError);
}
