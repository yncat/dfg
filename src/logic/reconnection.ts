import Cookies from "js-cookie";

const maxReconnectionMinute = 5;
const cookieName = "dfg_last_room_info";

export type ReconnectionInfo = {
  isReconnectionAvailable: boolean;
  playerName: string;
  reconnectionToken: string;
};

type ReconnectionCookie = {
  playerName: string;
  reconnectionToken: string;
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
  if (typeof castedCookie.reconnectionToken !== "string") {
    return false;
  }
  return true;
}

export interface Reconnection {
  startSession: (playerName: string, reconnectionToken: string) => void;
  endSession: () => void;
  getReconnectionInfo: () => ReconnectionInfo;
}

class ReconnectionImple implements Reconnection {
  public startSession(playerName: string, reconnectionToken: string): void {
    const v = { playerName, reconnectionToken };
    const expiresAt = new Date(
      new Date().getTime() + maxReconnectionMinute * 60 * 1000
    );
    Cookies.set(cookieName, JSON.stringify(v), {
      expires: expiresAt,
      path: "",
    });
  }

  public endSession() {
    Cookies.remove(cookieName, { path: "" });
  }

  public getReconnectionInfo(): ReconnectionInfo {
    const cookie = Cookies.get(cookieName);
    if (cookie === undefined) {
      return {
        isReconnectionAvailable: false,
        playerName: "",
        reconnectionToken: "",
      };
    }
    const cookieObj = JSON.parse(cookie);
    if (!isValidReconnectionCookie(cookieObj)) {
      return {
        isReconnectionAvailable: false,
        playerName: "",
        reconnectionToken: "",
      };
    }
    return {
      isReconnectionAvailable: true,
      playerName: cookieObj.playerName,
      reconnectionToken: cookieObj.reconnectionToken,
    };
  }
}

export function createReconnection(): Reconnection {
  return new ReconnectionImple();
}
