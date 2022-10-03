import { PublicKey, Transaction } from '@solana/web3.js'
import {
  ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from './constants'
import { TokenProgramInstructionService } from './TokenProgramInstructionService'

export class TokenProgramService {
  // address: ata address of owner
  static async getTokenAccountInfo (connection, address) {
    try {
      const accountInfo = await connection.getAccountInfo(address)
      const data = TokenProgramInstructionService.decodeTokenAccountInfo(
        accountInfo.data
      )
      data.address = address
      return data
    } catch (err) {
      return null
    }
  }

  // mintAddress: mint address token
  static async getTokenMintInfo (connection, mintAddress) {
    try {
      const accountInfo = await connection.getAccountInfo(mintAddress)
      const data = TokenProgramInstructionService.decodeTokenMintInfo(
        accountInfo.data
      )
      data.address = mintAddress
      return data
    } catch (err) {
      return null
    }
  }

  static async findAssociatedTokenAddress (walletAddress, tokenMintAddress) {
    try {
      const [address] = await PublicKey.findProgramAddress(
        [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          tokenMintAddress.toBuffer()
        ],
        ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
      return address || ''
    } catch (err) {
      return ''
    }
  }

  static async isAddressAvailable (connection, address) {
    const programInf = await connection.getAccountInfo(address)
    return programInf !== null
  }

  static async createAssociatedTokenAccount (
    payerAccount,
    ownerAddress,
    tokenMintAddress
  ) {
    const createATAInstruction =
      await TokenProgramInstructionService.createAssociatedTokenAccount(
        payerAccount,
        ownerAddress,
        tokenMintAddress
      )
    console.log({ createATAInstruction })
    return createATAInstruction
  }
}
