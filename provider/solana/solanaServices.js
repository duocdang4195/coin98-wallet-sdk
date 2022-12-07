import { get } from "lodash";
import { HashService } from "./hashService";
import * as ed from "@noble/ed25519";
import * as borsh from '@project-serum/borsh';
import base58 from "bs58";
import { PublicKey } from "@solana/web3.js";

const MessageRandomLayout = borsh.struct([
  borsh.publicKey('root'),
  borsh.publicKey('nftMint'),
]);

export class SolanaService {
  static async isAddressInUse(connection, address) {
    const programInf = await connection.getAccountInfo(address, 'confirmed');
    return programInf !== null;
  }

  static async isAddressAvailable(connection, address) {
    const programInf = await connection.getAccountInfo(address, 'confirmed');
    return programInf === null;
  }

  static hashMessage = (message) => {
    const buffer = Buffer.alloc(64)
  const span = MessageRandomLayout.encode(message, buffer)
  const serialize = buffer.slice(0, span)

  return HashService.keckka256(serialize)
  }

  static signMessage = async (adminAccount, message) => {
    const secretKey = get(adminAccount, 'secretKey', false);
    if (!secretKey) {
      return await window?.coin98?.sol
        .request({ method: 'sol_signMessage', params: ['0x' + message.toString('hex')] })
        .then(res => {
          const signature = get(res, 'signature');

          return Buffer.from(base58.decode(signature));
      })
    }
    const signature = await ed.sign(message, adminAccount.secretKey.slice(0, 32))

    return Buffer.from(signature)
  }

  static async findMetadataAddress(
    mint,
    tokenMetadataProgramId,
  ) {
    const [address,] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        tokenMetadataProgramId.toBytes(),
        mint.toBytes()
      ],
      tokenMetadataProgramId
    )

    return address
  }

  static async findMasterEditionAddress(
    mint,
    tokenMetadataProgramId,
  ) {
    const [address,] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        tokenMetadataProgramId.toBytes(),
        mint.toBytes(),
        Buffer.from("edition"),
      ],
      tokenMetadataProgramId
    )

    return address
  }
}
