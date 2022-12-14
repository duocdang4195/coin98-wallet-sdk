/* eslint-disable no-case-declarations */
import BigDecimal from 'js-big-decimal';
import { get, has } from 'lodash';
import { CHAIN_DATA, CHAIN_ID } from './constants';
import converter from 'hex2dec';
import { Keypair as SolAccount } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
const bs58 = require('bs58');
const bip39 = require('bip39');

export function size(data) {
  return data ? data.length : 0;
}

export function required(data, value, kind) {
  let bool;
  switch (kind) {
    case 'type':
      const dataType = typeof data;
      bool = value.includes(dataType);
      break;
    default:
      bool = size(data) > value;
      break;
  }
  if (!bool) {
    const message = 'Not meet kind condition ' + kind;
    throw message;
  }
  return true;
}

export const convertBase58 = (secretKey, isDecode) => {
  return isDecode
    ? bs58.decode(secretKey)
    : bs58.encode(Buffer.from(secretKey, 'hex'));
};

export const generateSeed = async (mnemonic) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  return seed;
};

export function createSolanaWallet(seed, isSollet, privateKey) {
  if (privateKey) {
    return SolAccount.fromSecretKey(convertBase58(privateKey, true), {
      skipValidation: false,
    });
  } else {
    const keyPair = nacl.sign.keyPair.fromSeed(
      isSollet ? derivePath(pathSollet, seed).key : seed.slice(0, 32)
    );
    const nodeSolana = new SolAccount(keyPair);
    return nodeSolana;
  }
}

export async function genOwnerSolana(wallet, deviceId, uuid) {
  try {
    let privateKey, seed;

    if (!wallet?.privateKey) {
      const decryptMnemonic = await decryptData({
        data: wallet.mnemonic,
        deviceId,
        uuid,
      });
      seed = await generateSeed(decryptMnemonic);
    } else {
      const decryptPrivateKey = await decryptData({
        data: wallet.privateKey,
        deviceId,
        uuid,
      });
      privateKey = decryptPrivateKey;
    }

    const owner = createSolanaWallet(seed, wallet.isSollet, privateKey);

    if (
      owner.publicKey.toString() === (wallet.walletAddress || wallet.address)
    ) {
      return owner;
    } else {
      if (privateKey) {
        return null;
      }
      const owner = createSolanaWallet(seed, !wallet.isSollet);
      return owner;
    }
  } catch (e) {
    return null;
  }
}

const handleSignMessageDapp = async ({ wallet, message }) => {
  try {
    let signature;
    const chain = get(wallet, 'chain');
    const addressWallet = get(wallet, 'address');
    if (chain !== CHAIN_ID.solana) {
      signature = await window.coin98?.provider.request({
        method: 'personal_sign',
        params: [message, addressWallet],
      });
    } else {
      const solanaSign = await window.coin98.sol.request({
        method: 'sol_signMessage',
        params: [message],
      });
      signature = get(solanaSign, 'signature');
    }
    return signature;
  } catch (err) {
    console.log({ err });
    return '';
  }
};

const convertBits = (data, fromWidth, toWidth, pad) => {
  let acc = 0;
  let bits = 0;
  const ret = [];
  const maxv = (1 << toWidth) - 1;
  // tslint:disable-next-line
  for (let p = 0; p < data.length; ++p) {
    const value = data[p];
    if (value < 0 || value >> fromWidth !== 0) {
      return null;
    }
    acc = (acc << fromWidth) | value;
    bits += fromWidth;
    while (bits >= toWidth) {
      bits -= toWidth;
      ret.push((acc >> bits) & maxv);
    }
  }

  if (pad) {
    if (bits > 0) {
      ret.push((acc << (toWidth - bits)) & maxv);
    }
  } else if (bits >= fromWidth || (acc << (toWidth - bits)) & maxv) {
    return null;
  }

  return Buffer.from(ret);
};

function rawToHuman(balance, decimals = 18) {
  try {
    required(balance, ['number', 'string', 'bigint'], 'type');
    const fmtDecimals = parseFloat(decimals);

    const multiplyNum = new BigDecimal(Math.pow(10, fmtDecimals));
    const convertValue = new BigDecimal(balance);
    return convertValue.divide(multiplyNum, fmtDecimals).getValue();
  } catch (error) {
    return 0;
  }
}

const splitAddress = (address, options) => {
  const isVersion2 = get(options, 'isVersion2', false);
  const numSplit = get(options, 'numSplit');

  if (address) {
    return (
      address.substring(0, isVersion2 ? 4 : numSplit || 10) +
      (isVersion2 ? ' **** **** ' : ' ... ') +
      address.substring(
        size(address) - (isVersion2 ? 4 : numSplit || 10),
        size(address)
      )
    );
  } else {
    return '';
  }
};

const genTokenType = (chain, address) => {
  const chainSelect = CHAIN_DATA[chain];
  if (chainSelect) {
    const defaultName = chainSelect.symbolSpecial || '';

    return chainSelect.isToken
      ? address && address.length > 0
        ? chain === CHAIN_ID.tron
          ? !isNaN(parseFloat(address))
            ? chainSelect.trcSubName
            : chainSelect.trcToken
          : chain === CHAIN_ID.terra || chain === CHAIN_ID.terra2
          ? size(address) <= 4
            ? 'DENOM'
            : chainSelect.trcToken
          : chainSelect.trcToken
        : defaultName
      : defaultName;
  }
};

function crawlCache(key, pointer, worker, time = 5000) {
  const currentTime = Date.now();

  const dataCache = pointer[key];

  // Return cache data if meet time requirement
  if (has(dataCache, 'data') && currentTime - dataCache.time <= time) {
    return dataCache.data;
  }

  return worker()
    .then((data) => {
      if (!data) return;
      pointer[key] = { data, time: currentTime };
      return data;
    })
    .catch();
}

const convertHexToDecimal = (hexNum) => {
  if (hexNum && !hexNum?.toString().startsWith('0x')) return hexNum;
  return converter.hexToDec(hexNum);
};
const convertDecimalToHex = (number) => {
  if (number && number?.toString().startsWith('0x')) return number;

  return converter.decToHex(number.toString());
};

function compare(x, y) {
  return new BigDecimal(x).compareTo(new BigDecimal(y));
}

function multiply(x, y, digits) {
  return new BigDecimal(x)
    .multiply(new BigDecimal(y))
    [digits ? 'getPrettyValue' : 'getValue'](digits);
}
function divide(x, y, digits) {
  return new BigDecimal(x)
    .divide(new BigDecimal(y))
    [digits ? 'getPrettyValue' : 'getValue'](digits);
}
function add(x, y, digits) {
  return new BigDecimal(x)
    .add(new BigDecimal(y))
    [digits ? 'getPrettyValue' : 'getValue'](digits);
}
function subtract(x, y, digits) {
  return new BigDecimal(x)
    .subtract(new BigDecimal(y))
    [digits ? 'getPrettyValue' : 'getValue'](digits);
}

async function decryptData({ data, uuid, deviceId }) {
  const decryptedData = () =>
    window.coin98?.provider.request({
      method: 'aes_decrypt_coin98',
      params: { data: data, uuid, deviceId },
    });

  const requestConnect = () =>
    window.coin98?.provider.request({
      method: 'connect_coin98',
      params: { uuid, txtConnect: 'autoConnect' },
    });

  return new Promise(async (resolve) => {
    const timeOutRef = setTimeout(async () => {
      await requestConnect();
      const decryptedKey = await decryptedData();

      resolve(decryptedKey);
    }, 5000);

    const decryptedKey = await decryptedData();

    clearTimeout(timeOutRef);

    resolve(decryptedKey);
  });
}

async function sendConfirmTransaction(txn) {
  const sign = await window.coin98?.provider.request({
    method: 'eth_sendTransaction',
    params: [txn],
  });

  return sign;
}

export default {
  convertHexToDecimal,
  convertDecimalToHex,
  Math: {
    compare,
    add,
    subtract,
    divide,
    multiply,
  },
  genTokenType,
  splitAddress,
  rawToHuman,
  crawlCache,
  convertBits,
  decryptData,
  sendConfirmTransaction,
  handleSignMessageDapp,
  genOwnerSolana,
};
