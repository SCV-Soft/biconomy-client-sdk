import type {
  HDAccount,
  Hex,
  LocalAccount,
  PrivateKeyAccount,
  SignableMessage,
  TypedData,
  TypedDataDefinition
} from "viem"
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts"
import type { SmartAccountSigner } from "../utils/Types.js"

export class LocalAccountSigner<
  T extends HDAccount | PrivateKeyAccount | LocalAccount
> implements SmartAccountSigner<T>
{
  inner: T
  signerType: string

  constructor(inner: T) {
    this.inner = inner
    this.signerType = inner.type //  type: "local"
  }

  readonly signMessage: (message: SignableMessage) => Promise<`0x${string}`> = (
    message
  ) => {
    return this.inner.signMessage({ message })
  }

  readonly signTypedData = async <
    const TTypedData extends TypedData | { [key: string]: unknown },
    TPrimaryType extends string = string
  >(
    params: TypedDataDefinition<TTypedData, TPrimaryType>
  ): Promise<Hex> => {
    return this.inner.signTypedData(params)
  }

  readonly getAddress: () => Promise<`0x${string}`> = async () => {
    return this.inner.address
  }

  static mnemonicToAccountSigner(key: string): LocalAccountSigner<HDAccount> {
    const signer = mnemonicToAccount(key)
    return new LocalAccountSigner(signer)
  }

  static privateKeyToAccountSigner(
    key: Hex
  ): LocalAccountSigner<PrivateKeyAccount> {
    const signer = privateKeyToAccount(key)
    return new LocalAccountSigner(signer)
  }
}
