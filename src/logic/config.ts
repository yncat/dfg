export class Config {
  public readonly serverAddress: string;
  constructor(address: string | undefined) {
    const address_default = "ws://localhost:2567";
    this.serverAddress =
      address === undefined || address === "" ? address_default : address;
  }
}
