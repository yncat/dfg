import Cookies from "js-cookie";

const maxReconnectionMinute = 5;
const cookieName = "dfg_last_room_info";

export function startSession(playerName: string, sessionID: string): void {
  const v = { playerName, sessionID };
  const expiresAt = new Date(
    new Date().getTime() + maxReconnectionMinute * 60 * 1000
  );
  Cookies.set(cookieName, JSON.stringify(v), { expires: expiresAt, path: "" });
}

export function endSession() {
  Cookies.remove(cookieName, { path: "" });
}

export type ReconnectionInfo = {
  isReconnectionAvailable: boolean;
  playerName: string;
  sessionID: string;
};

type ReconnectionCookie = {
  playerName: string;
  sessionID: string;
};

function isValidReconnectionCookie(
  cookie: unknown
): cookie is ReconnectionCookie {
  if (!cookie) {
    return false;
  }
  if (typeof cookie !== "object") {
    return false;
  }
  const castedCookie = cookie as ReconnectionCookie;
  if (typeof castedCookie.playerName !== "string") {
    return false;
  }
  if (typeof castedCookie.sessionID !== "string") {
    return false;
  }
  return true;
}

export function getReconnectionInfo(): ReconnectionInfo {
  const cookie = Cookies.get(cookieName);
  if (cookie === undefined) {
    return {
      isReconnectionAvailable: false,
      playerName: "",
      sessionID: "",
    };
  }
  const cookieObj = JSON.parse(cookie);
  if (!isValidReconnectionCookie(cookieObj)) {
    return {
      isReconnectionAvailable: false,
      playerName: "",
      sessionID: "",
    };
  }
  return {
    isReconnectionAvailable: true,
    playerName: cookieObj.playerName,
    sessionID: cookieObj.sessionID,
  };
}
