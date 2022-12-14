import { PublicKey, Transaction } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './constants';
import { TokenProgramInstructionService } from './tokenProgram_Instruction_Service';

export class TokenProgramService {
  // address: ata address of owner
  static async getTokenAccountInfo(connection, address) {
    try {
      const accountInfo = await connection.getAccountInfo(address);
      const data = TokenProgramInstructionService.decodeTokenAccountInfo(
        accountInfo.data
      );
      data.address = address;
      return data;
    } catch (err) {
      return null;
    }
  }

  // mintAddress: mint address token
  static async getTokenMintInfo(connection, mintAddress) {
    try {
      const accountInfo = await connection.getAccountInfo(mintAddress);
      const data = TokenProgramInstructionService.decodeTokenMintInfo(
        accountInfo.data
      );
      data.address = mintAddress;
      return data;
    } catch (err) {
      return null;
    }
  }

  static findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    try {
      const [address] = PublicKey.findProgramAddressSync(
        [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          tokenMintAddress.toBuffer(),
        ],
        ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      );
      return address || '';
    } catch (err) {
      return '';
    }
  }

  static async approve(
    wallet,
    payerAccount,
    payerTokenAddress,
    delegateAddress,
    amount
  ) {
    const transaction = new Transaction();
    const approveInstruction = TokenProgramInstructionService.approve(
      payerAccount.publicKey,
      payerTokenAddress,
      delegateAddress,
      amount
    );
    transaction.add(approveInstruction);

    const txSign = await window.wallet.sendTransactionSolana({
      transactions: transaction,
      signers: [payerAccount],
      wallet,
      chainType: 'solana',
      options: {
        isWaitDone: true,
      },
    });
    return txSign;
  }

  static async isAddressAvailable(connection, address) {
    const programInf = await connection.getAccountInfo(address);
    return programInf !== null;
  }

  static async createAssociatedTokenAccount(
    payerAccount,
    ownerAddress,
    tokenMintAddress
  ) {
    const createATAInstruction =
      await TokenProgramInstructionService.createAssociatedTokenAccount(
        payerAccount,
        ownerAddress,
        tokenMintAddress
      );
    return createATAInstruction;
  }

  static async findOrCreateAssociatedTokenAccount({
    connection,
    payerAddress,
    ownerAddress,
    tokenMintAddress,
    transactions,
  }) {
    const ownerATATokenMint =
      TokenProgramService.findAssociatedTokenAddress(
        ownerAddress,
        tokenMintAddress
      );
    const isAvailable = await TokenProgramService.isAddressAvailable(
      connection,
      ownerATATokenMint
    );
    if (!isAvailable) {
      const createATAInstruction =
        await TokenProgramService.createAssociatedTokenAccount(
          payerAddress,
          ownerAddress,
          tokenMintAddress
        );
      transactions && transactions.add(createATAInstruction);
      return [ownerATATokenMint, createATAInstruction];
    }

    return [ownerATATokenMint, null];
  }
}
