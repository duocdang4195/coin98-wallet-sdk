import * as borsh from '@project-serum/borsh';
import { BorshService } from './borshService';
import BN from 'js-big-decimal';
import {
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './constants';
import { TokenProgramService } from './tokenProgram_Service';

const TOKEN_PROGRAM_LAYOUT = {
  APPROVE: borsh.struct([borsh.u8('instruction'), borsh.u64('amount')]),
  BURN: borsh.struct([borsh.u8('instruction'), borsh.u64('amount')]),
  CHANGE_AUTHORITY: borsh.struct([
    borsh.u8('instruction'),
    borsh.u8('type'),
    borsh.option(borsh.publicKey(), 'authority'),
  ]),
  CLOSE_ACCOUNT: borsh.struct([borsh.u8('instruction')]),
  INITIALIZE_ACCOUNT: borsh.struct([borsh.u8('instruction')]),
  INITIALIZE_MINT: borsh.struct([
    borsh.u8('instruction'),
    borsh.u8('decimals'),
    borsh.publicKey('mintAuthority'),
    borsh.option(borsh.publicKey(), 'freezeAuthority'),
  ]),
  MINT: borsh.struct([borsh.u8('instruction'), borsh.u64('amount')]),
  TOKEN_ACCOUNT: borsh.struct([
    borsh.publicKey('mint'),
    borsh.publicKey('owner'),
    borsh.u64('amount'),
    borsh.u32('delegateOption'),
    borsh.publicKey('delegate'),
    borsh.u8('state'),
    borsh.u32('isNativeOption'),
    borsh.u64('isNative'),
    borsh.u64('delegatedAmount'),
    borsh.u32('closeAuthorityOption'),
    borsh.publicKey('closeAuthority'),
  ]),
  TOKEN_MINT: borsh.struct([
    borsh.u32('mintAuthorityOption'),
    borsh.publicKey('mintAuthority'),
    borsh.u64('supply'),
    borsh.u8('decimals'),
    borsh.u8('isInitialized'),
    borsh.u32('freezeAuthorityOption'),
    borsh.publicKey('freezeAuthority'),
  ]),
  TRANSFER: borsh.struct([borsh.u8('instruction'), borsh.u64('amount')]),
};

const CREATE_ASSOCIATED_TOKEN_ACCOUNT_LAYOUT = borsh.struct([]);

export class TokenProgramInstructionService {
  static decodeTokenMintInfo(data) {
    const decodedData = BorshService.deserialize(
      TOKEN_PROGRAM_LAYOUT.TOKEN_MINT,
      data
    );
    return {
      supply: decodedData.supply,
      decimals: decodedData.decimals,
      isInitialized: decodedData.isInitialized !== 0,
      mintAuthority:
        decodedData.mintAuthorityOption === 0
          ? null
          : decodedData.mintAuthority,
      freezeAuthority:
        decodedData.freezeAuthorityOption === 0
          ? null
          : decodedData.freezeAuthority,
    };
  }

  static decodeTokenAccountInfo(data) {
    const decodedData = BorshService.deserialize(
      TOKEN_PROGRAM_LAYOUT.TOKEN_ACCOUNT,
      data
    );
    return {
      mint: decodedData.mint,
      owner: decodedData.owner,
      amount: decodedData.amount,
      delegate: decodedData.delegateOption === 0 ? null : decodedData.delegate,
      delegatedAmount:
        decodedData.delegateOption === 0
          ? new BN(0)
          : decodedData.delegatedAmount,
      isInitialized: decodedData.state !== 0,
      isFrozen: decodedData.state === 2,
      isNative: decodedData.isNativeOption === 1,
      rentExemptReserve:
        decodedData.isNativeOption === 1 ? decodedData.isNative : null,
      closeAuthority:
        decodedData.closeAuthorityOption === 0
          ? null
          : decodedData.closeAuthority,
    };
  }

  static async createAssociatedTokenAccount(
    payerAddress,
    ownerAddress,
    tokenMintAddress
  ) {
    const tokenAccountAddress =
      await TokenProgramService.findAssociatedTokenAddress(
        ownerAddress,
        tokenMintAddress
      );
    const request = {};
    const keys = [
      { pubkey: payerAddress, isSigner: true, isWritable: true },
      { pubkey: tokenAccountAddress, isSigner: false, isWritable: true },
      { pubkey: ownerAddress, isSigner: false, isWritable: false },
      { pubkey: tokenMintAddress, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    const data = BorshService.serialize(
      CREATE_ASSOCIATED_TOKEN_ACCOUNT_LAYOUT,
      request,
      10
    );

    return new TransactionInstruction({
      keys,
      data,
      programId: ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    });
  }

  static createTransferTransaction(
    ownerAddress,
    sourceTokenAddress,
    targetTokenAddress,
    amount
  ) {
    const keys = [
      { pubkey: sourceTokenAddress, isSigner: false, isWritable: true },
      { pubkey: targetTokenAddress, isSigner: false, isWritable: true },
      { pubkey: ownerAddress, isSigner: true, isWritable: false },
    ];
    const data = BorshService.serialize(
      TOKEN_PROGRAM_LAYOUT.TRANSFER,
      {
        instruction: 3,
        amount,
      },
      10
    );
    const instruction = new TransactionInstruction({
      keys,
      data,
      programId: TOKEN_PROGRAM_ID,
    });
    return instruction;
  }

  static initializeMint(
    tokenMintAddress,
    decimals,
    mintAuthorityAddress,
    freezeAuthorityAddress
  ) {
    const request = {
      instruction: 0,
      decimals,
      mintAuthority: mintAuthorityAddress,
      freezeAuthority: freezeAuthorityAddress,
    };
    const keys = [
      { pubkey: tokenMintAddress, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    const data = BorshService.serialize(
      TOKEN_PROGRAM_LAYOUT.INITIALIZE_MINT,
      request,
      67
    );

    return new TransactionInstruction({
      keys,
      data,
      programId: TOKEN_PROGRAM_ID,
    });
  }

  static mint(authorityAddress, tokenMintAddress, targetTokenAddress, amount) {
    const request = {
      instruction: 7,
      amount: amount,
    };
    const keys = [
      { pubkey: tokenMintAddress, isSigner: false, isWritable: true },
      { pubkey: targetTokenAddress, isSigner: false, isWritable: true },
      { pubkey: authorityAddress, isSigner: true, isWritable: false },
    ];
    const data = BorshService.serialize(TOKEN_PROGRAM_LAYOUT.MINT, request, 10);

    return new TransactionInstruction({
      keys,
      data,
      programId: TOKEN_PROGRAM_ID,
    });
  }

  static approve(ownerAddress, ownerTokenAddress, delegateAddress, amount) {
    const request = {
      instruction: 4,
      amount: amount,
    };
    const keys = [
      { pubkey: ownerTokenAddress, isSigner: false, isWritable: true },
      { pubkey: delegateAddress, isSigner: false, isWritable: false },
      { pubkey: ownerAddress, isSigner: true, isWritable: false },
    ];
    const data = BorshService.serialize(APPROVE_LAYOUT, request, 10);

    return new TransactionInstruction({
      keys,
      data,
      programId: TOKEN_PROGRAM_ID,
    });
  }
}
