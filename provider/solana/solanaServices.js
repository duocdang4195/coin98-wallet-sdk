import { get } from "lodash";
import { HashService } from "./hashService";

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
        .request({ method: 'sol_signMessage', params: [message] })
        .then(res => {
          const signature = get(res, 'signature');

          return Buffer.from(signature)
      })
    }
    const signature = await ed.sign(message, adminAccount.secretKey.slice(0, 32))

    return Buffer.from(signature)
  }
}
