export class SolanaService {
  static async isAddressInUse(connection, address) {
    const programInf = await connection.getAccountInfo(address, 'confirmed');
    return programInf !== null;
  }

  static async isAddressAvailable(connection, address) {
    const programInf = await connection.getAccountInfo(address, 'confirmed');
    return programInf === null;
  }
}
