import * as bip39 from "bip39";
import * as consts from "@/utils/constants";
import Seed from "./seed";

export default class Mnemonic {
  private _mnemonic = "";
  private _passphrase = "";

  constructor(strength: number);
  constructor(mnemonic: string);
  constructor();
  constructor(value?: number | string) {
    if (typeof value == "string") {
      if (!bip39.validateMnemonic(value)) {
        throw "Invalid mnemonic";
      }

      this._mnemonic = value;
      return;
    }

    this._mnemonic = this.newMnemonic(value || consts.defaultStrength);
  }

  private newMnemonic(strength: number): string {
    return bip39.generateMnemonic(strength);
  }

  public setPassphrase(passphrase: string): void {
    this._passphrase = passphrase;
  }

  public getPassphrase(): string {
    return this._passphrase;
  }

  public async toSeed(): Promise<Seed> {
    return bip39
      .mnemonicToSeed(this._mnemonic, this._passphrase)
      .then((buffer) => {
        return new Seed(buffer);
      })
      .catch((reason) => {
        return Promise.reject(reason);
      });
  }

  public toString(): string {
    return this._mnemonic;
  }
}
