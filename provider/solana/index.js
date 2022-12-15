import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import get from 'lodash/get';
import compact from 'lodash/compact';
import chunk from 'lodash/chunk';
import { TokenProgramInstructionService } from './tokenProgram_Instruction_Service';
import { TokenProgramService } from './tokenProgram_Service';
import {
  EXCEED_LIMIT,
  INSUFFICIENT_FUNDS,
  MESS_000,
  TRANSACTION_FAILED,
  TRANSACTION_LARGE,
} from '../messages';
import { NATIVE_SOL } from './constants';
import utils, { required } from '../../common/utils';
import { IdlParserService } from './idl_Parser_Services';
import { SolanaService } from './solanaServices';
const bs58 = require('bs58');

class SolanaProvider {
  constructor(
    options = {
      rpc: 'https://ssc-dao.genesysgo.net/',
    }
  ) {
    // this.chainSetting =  Connector.getChainSetting(options.key)
    this.chainSetting = NATIVE_SOL;
    this.rpc = options.rpc;
    if (get(options, 'options', false)) {
      this.rpc = get(options, 'options.rpc', options.rpc);
    }

    this.client = new Connection(this.rpc, {
      commitment: 'confirmed',
    });
    this.TokenProgramService = TokenProgramService;
    this.TokenProgramInstructionService = TokenProgramInstructionService;
    this.IdlParserService = IdlParserService;
    this.SolanaService = SolanaService;
    // this.isAddress = this.isAddress.bind(this)
    // this.balance = this.balance.bind(this)
    // this.balanceOf = this.balanceOf.bind(this)
    // this.balanceOfMultipleAddress = this.balanceOfMultipleAddress.bind(this)
    // this.transfer = this.transfer.bind(this)
  }

  // Validate an solana wallet address
  // Check that a pubkey is on the ed25519 curve.
  // type address: number | string | Buffer | Uint8Array | number[]
  // return boolean
  isAddress(address) {
    try {
      return PublicKey.isOnCurve(address);
    } catch (err) {
      return false;
    }
  }

  // get the current block that the node is processing
  // getCurrentBlock () {
  //   return this.client.getSlot()
  // }

  // address of wallet is publickey
  // return balance of wallet
  async balance(address, options) {
    const worker = async () => {
      const rawBalance = await this.client.getBalance(new PublicKey(address));
      return get(options, 'isRaw')
        ? rawBalance
        : utils.rawToHuman(rawBalance, this.chainSetting.decimals);
    };

    return utils.crawlCache(address + 'balance', this, worker, 5000);
  }

  // ownerAddress: Publickey
  // return balance token of owner address
  async balanceOf(ownerAddress, options) {
    // address: mintAddress of token type Publickey
    // decimals: decimal of token
    // isRaw: if want to get raw balance
    const { address, decimals, isRaw } = options;
    required(address, 0);
    required(decimals, 0);
    try {
      const worker = async () => {
        const ata = await TokenProgramService.findAssociatedTokenAddress(
          ownerAddress,
          address
        );
        const info = await TokenProgramService.getTokenAccountInfo(
          this.client,
          ata
        );
        const rawBalance = get(info, 'amount', '').toString();
        return isRaw ? rawBalance : utils.rawToHuman(rawBalance, decimals);
      };

      return utils.crawlCache(
        ownerAddress + 'balanceOf' + get(options, 'contract'),
        this,
        worker,
        get(options, 'isLatest') ? 0 : 5000
      );
    } catch (err) {
      return 0;
    }
  }

  // ownerAddress: Publickey
  // return list balance token
  async balanceOfMultipleAddress(ownerAddress, tokenList, options) {
    required(tokenList, 0);
    required(ownerAddress.toString(), 0);

    try {
      const addressChain = compact(
        tokenList.map((token) => token.address)
      ).filter((item) => item !== NATIVE_SOL.mintAddress);
      // find ata address base owner address
      const arrAta = await Promise.all(
        addressChain.map(async (mint, index) => {
          const mintAddress = new PublicKey(mint);
          const ata = await TokenProgramService.findAssociatedTokenAddress(
            ownerAddress,
            mintAddress
          );
          return ata;
        })
      );
      // fetch account info of list ata
      const response = await this.callPostMultipleRequest({
        method: 'getMultipleAccounts',
        listAddress: arrAta,
      });

      const accountData = response.map((item) => {
        // convert data from base64 to buffer
        const buffer = Buffer.from(get(item, 'data[0]'), 'base64');
        // decode account info from buffer
        const info = buffer
          ? TokenProgramInstructionService.decodeTokenAccountInfo(buffer)
          : null;
        return info;
      });

      const mapData = accountData.map((item) => {
        if (!item) return null;
        return {
          walletAddress: ownerAddress.toString(),
          chain: this.chainSetting.key,
          address: get(item, 'mint', '').toString(),
          rawBalance: get(item, 'amount', '').toString(),
        };
      });

      return compact(mapData).sort(
        (a, b) => parseFloat(b.rawBalance) - parseFloat(a.rawBalance)
      );
    } catch (error) {
      return [];
    }
  }

  // receiver: destination wallet address -> Publickey
  // wallet: wallet to send txs
  // mintAddress: token mint address -> Publickey
  // amount: amount wei transfer -> Bignumber
  async transfer(receiver, wallet, mintAddress, amount, options) {
    if (!this.isAddress(receiver)) throw MESS_000;

    const transaction = new Transaction();

    const sourceAddress = await TokenProgramService.findAssociatedTokenAddress(
      wallet.publicKey,
      mintAddress
    );

    let destinationAddress = receiver;

    // check if mint address different SOL, destination address is ata of receiver
    if (mintAddress.toString() !== NATIVE_SOL.mintAddress) {
      destinationAddress = await TokenProgramService.findAssociatedTokenAddress(
        receiver,
        mintAddress
      );
      // check if address not available -> create new address with mint
      if (
        !(await TokenProgramService.isAddressAvailable(
          this.client,
          destinationAddress
        ))
      ) {
        const createAtaInstruction =
          await TokenProgramService.createAssociatedTokenAccount(
            wallet.publicKey,
            receiver,
            mintAddress
          );
        transaction.add(createAtaInstruction);
      }
    }

    const instructionTransfer =
      TokenProgramInstructionService.createTransferTransaction(
        wallet.publicKey,
        sourceAddress,
        destinationAddress,
        amount
      );
    transaction.add(instructionTransfer);
    const hash = await this.sendTransaction({
      transactions: transaction,
      wallet,
      signers: [wallet.publicKey],
    });
    console.log({ hash });
    return hash;
  }

  async signTransaction(transaction, secretKey) {
    
    if (secretKey) {
      const payer = Keypair.fromSecretKey(bs58.decode(secretKey));
      const dataSign = transaction.serializeMessage();
      const signature = await SolanaService.signMessage(payer, dataSign);

      transaction.addSignature(payer.publicKey, signature);
      return transaction;
    }

    return window?.coin98?.sol
      .request({ method: 'sol_sign', params: [transaction] })
      .then((res) => {
        const sig = Buffer.from(bs58.decode(res.signature));
        const publicKey = new PublicKey(res.publicKey);
        transaction.addSignature(publicKey, sig);
        return transaction;
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  // transactions
  // addressWallet: Publickey
  // signers Publickey[]: arr signer
  // options: add key to handle something
  async postBaseSendTxs({ transactions, wallet, signers, options = {} }) {
    if (!wallet.publicKey) {
      throw new Error(`No publicKey for wallet: ${wallet}`);
    }
    // isWaitDone: if you want to wait txs max confirmed -> boolean
    // callBackFinal: execute when txs max confirmed -> func
    // callBack: execute when txs confirmed at least one ->
    // dataReturn: if you want to return data -> any
    const { isWaitDone, callBackFinal, dataReturn, callBack } = options;

    // add recent block
    transactions.recentBlockhash = (
      await this.client.getRecentBlockhash('max')
    ).blockhash;

    // add fee payer
    transactions.feePayer = wallet.publicKey;
    const decryptedSecretKey = await utils?.decryptData({
      privateKey: get(wallet, 'privateKey'),
      uuid: get(options, 'uuid'),
      deviceId: get(options, 'deviceId'),
    });

    if (!decryptedSecretKey) {
      throw new Error('Cannot detech your wallet');
    }

    transactions = await this.signTransaction(transactions, decryptedSecretKey);

    if (signers.length > 1) {
      const getSignerValid = signers.slice().filter((it) => it.secretKey);
      transactions.partialSign(...getSignerValid);
    }
    transactions = transactions.serialize();
    const tx = await this.client
      .sendRawTransaction(transactions, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })
      .catch((err) => {
        const data = JSON.stringify(get(err, 'logs', ''));
        return { isErr: true, data: data };
      });
    const { isErr } = tx;
    if (isErr) {
      console.log({ tx });
      return tx;
    }
    callBack && callBack(tx, dataReturn);

    // wait for txs confirmed
    return new Promise((resolve) => {
      console.log({ tx });
      
      if (!isWaitDone) {
        resolve(tx);
      } 
      
      this.client.onSignatureWithOptions(
        tx,
        () => {
          callBackFinal && callBackFinal(tx, dataReturn);
          resolve(tx);
        },
        {
          commitment: 'confirmed',
          enableReceivedNotification: true,
        }
      );
    })
  }

  encodeMessErr(mess) {
    const text = mess ? get(mess, 'mess', mess).toString() : '';
    const stringResult = text.toLowerCase();
    if (stringResult.includes('error')) {
      switch (true) {
        case stringResult.includes('exceeds desired slippage limit'):
          mess = EXCEED_LIMIT;
          break;
        case stringResult.includes('insufficient funds'):
        case stringResult.includes('insufficient'):
          mess = INSUFFICIENT_FUNDS;
          break;
        case stringResult.includes('transaction too large'):
          mess = TRANSACTION_LARGE;
          break;
        default:
          mess = TRANSACTION_FAILED;
      }
      return mess;
    }
  }

  rawTokenToHuman = (tokenData, walletAddress) => (iBalance, index) => {
    const formatBalance = parseFloat(iBalance);

    // Require balance greater than zero
    if (formatBalance > 0) {
      return {
        walletAddress,
        chain: this.chainSetting.key,
        address: this.toSUM(tokenData[index]),
        rawBalance: iBalance,
      };
    }
  };

  getMainToken() {
    return {
      price: 0,
      cgkId: this.chainSetting.id,
      symbol: this.chainSetting.symbol,
      name: this.chainSetting.name,
      // image: AWS_CURRENCY(this.chainSetting.key),
      decimals: this.chainSetting.decimals || 9,
    };
  }

  // listAddress is array publickey to fetch data
  // method is method name of @solana/web3 "https://docs.solana.com/developing/clients/jsonrpc-api"
  async callPostMultipleRequest({ method, listAddress }) {
    try {
      // maximum each request is 100
      const numberSplit = 100;
      const arrChunk = chunk(listAddress, numberSplit);

      const bodyFetch = arrChunk.map((arrAccount) => {
        // const body = JSON.stringify()
        const body = {
          method,
          params: [arrAccount.map((item) => item), { commitment: 'confirmed' }],
          id: 1,
          jsonrpc: '2.0',
        };
        return body;
      });
      const response = await Promise.all(
        bodyFetch.map((item) => this.buildRequest(JSON.stringify(item)))
      );
      if (!response) return [];
      let arrData = compact(response);

      arrData = arrData.flat(arrChunk.length).map((data) => {
        const result = get(data, 'result', {});
        return get(result, 'value');
      });
      return arrData.flat();
    } catch (err) {
      return [];
    }
  }

  async buildRequest(body) {
    try {
      const response = await fetch(this.rpc, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authority: 'coin98.com',
          Authorization: 'Bearer token',
          development: 'coin98',
        },
        body,
      });

      if (response.ok) {
        return response.json();
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}

export default SolanaProvider;
