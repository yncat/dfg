import React from "react";
import { versionHash, builtAt } from "../versionInfo";

export default function Version() {
  return <div className="Version">Build version: {versionHash} ({builtAt})</div>;
}
