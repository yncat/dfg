import { ConnectionStatusI18n } from "./interfaces";

export class ConnectionStatusJapanese implements ConnectionStatusI18n {
  public notConnected(): string {
    return "未接続";
  }

  public connecting(): string {
    return "接続中...";
  }

  public connected(playerCount: number): string {
    return "接続済み(現在オンライン: " + playerCount + ")";
  }
}
