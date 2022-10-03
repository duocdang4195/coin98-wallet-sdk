import Web3 from 'web3'
import utils, { required } from '../common/utils'
import ABI from '../module/ABI'
import Connector from '../system/connector'
import compact from 'lodash/compact'
import get from 'lodash/get'
import messages from './messages'
import { AWS_CURRENCY, CHAIN_ID } from '../common/constants'
import { bech32 } from 'bech32'
import useNFTs from '../services/nfts'

// Provider for all EVM types chain, something like Ether, BNB Chain, Avax-C ....
// Readmore about EVM types chain in https://web3js.readthedocs.io/, https://docs.ethers.io/v5/
// Contructor must includes key chain and options if needed anything else
class EVMProvider {
  constructor (options) {
    this.chainSetting = Connector.getChainSetting(options.key)
    this.client = new Web3()

    let clientOptions = {}

    if (get(this.chainSetting, 'rpcOptions')) {
      clientOptions = this.chainSetting.rpcOptions
    }

    this.chainId = get(this.chainSetting, 'numChainId')

    this.client.setProvider(new this.client.providers.HttpProvider(options.rpc, clientOptions))

    // For a case testnet or missing chainId
    if (!this.chainId) {
      this.chainId = this.client.getChainId()
    }
    this.nftServices = useNFTs(97)
  }

  // Validate an evm address
  // Rule starts with '0x' and 40 characters after that
  isAddress (address) {
    // Normal case starts with '0x'
    // For case EVM chain has a special prefix like ronin and harmony ( ronin: or ONE: )
    const startWithCharacters = this.chainSetting.prefix || '0x'
    const numCharacters = this.chainSetting.numCharacters || 40
    const reg = new RegExp(`^(${startWithCharacters})[0-9A-Fa-f]{${numCharacters}}$`)
    const isValid = reg.test(address)
    return isValid
  }

  // isLatest, isRaw
  async balance (address, options) {
    try {
      const worker = async () => {
        let block = 'latest'

        // For klaytn get balance
        if (this.chainSetting.isGetFromBlock) {
          block = await this.client.eth.getBlockNumber()
        }

        const rawBalance = await this.client.eth.getBalance(address, block)

        return get(options, 'isRaw') ? rawBalance : utils.rawToHuman(rawBalance, this.chainSetting.decimals)
      }

      return utils.crawlCache(address + 'balance', this, worker, get(options, 'isLatest') ? 0 : 5000)
    } catch (error) {
      return 0
    }
  }

  async balanceOf (address, options) {
    required(get(options, 'contract.address'), 0)
    try {
      const worker = async () => {
        const tokenContract = this.getContract(get(options, 'contract.address'), ABI.erc20)

        const rawBalance = await this.callContract(tokenContract, 'balanceOf', [address])
        return get(options, 'isRaw') ? rawBalance : utils.rawToHuman(rawBalance, get(options, 'contract.decimals'))
      }

      return utils.crawlCache(address + 'balanceOf' + get(options, 'contract.address'), this, worker, get(options, 'isLatest') ? 0 : 5000)
    } catch (error) {
      return 0
    }
  }

  async balanceOfMultipleAddress (address, tokenList, options) {
    required(tokenList, 0)
    try {
      const numberSplit = 1000
      const addressChain = compact(tokenList.map(token => token.address))

      const contractBalances = this.getContract(this.chainSetting.balances, ABI.balances)

      const worker = async (start) => {
        // Split address into multiple part for loading balance
        const splitTokenData = addressChain.slice(start, start + numberSplit)
        // Call load token balances from smart contract
        return this.callContract(contractBalances, 'balances', [[address], splitTokenData]).then(onChainData => {
          const mapData = onChainData.map(this.rawTokenToHuman(splitTokenData, address))
          return mapData
        }).catch()
      }

      const fullResponse = []

      for (let i = 0; i < addressChain.length; i += numberSplit) {
        const dataToken = await worker(i)
        dataToken && Array.prototype.push.apply(fullResponse, dataToken)
      }
      return compact(fullResponse)
    } catch (error) {
      return []
    }
  }

  async transfer (receiver, amount, wallet, options) {
    if (!this.isAddress(receiver)) throw messages.MESS_000

    let realReceiver = receiver
    // Chain started with prefix need to format to EVM address before sending
    if (this.chainSetting.prefix && receiver.startsWith(this.chainSetting.prefix)) {
      realReceiver = this.formatPrefixAddress(receiver, true)
    }

    return this.postBaseSendTxs(wallet, Object.assign(options, { amount, receiver: realReceiver }))
  }

  formatPrefixAddress (address, isRevert) {
    if (this.chainSetting.key === CHAIN_ID.harmony) {
      if (isRevert) {
        return this.fromBech32(address)
      }

      const prefix = 'one'
      const words = bech32.toWords(Buffer.from(address.replace('0x', ''), 'hex'))
      return bech32.encode(prefix, words)
    } else {
      return address.replace(this.chainSetting.prefix, '0x')
    }
  }

  syncNFT () {
    this.nftServices.sync()
    return true
  }

  fetchNFT (address) {
    return this.nftServices.get(address)
  }

  rawTokenToHuman = (tokenData, walletAddress) => (iBalance, index) => {
    const formatBalance = parseFloat(iBalance)

    // Require balance greater than zero
    if (formatBalance > 0) {
      return {
        walletAddress,
        chain: this.chainSetting.key,
        address: this.toSUM(tokenData[index]),
        rawBalance: iBalance
      }
    }
  }

  getMainToken () {
    return {
      price: 0,
      cgkId: this.chainSetting.id,
      symbol: this.chainSetting.symbol,
      name: this.chainSetting.name,
      image: AWS_CURRENCY(this.chainSetting.key),
      decimals: this.chainSetting.decimals || 18
    }
  }

  fromBech32 (address) {
    const response = bech32.decode(address)

    const buf = utils.convertBits(response.words, 5, 8, false)

    if (buf === null) {
      return ''
    }

    return this.toSUM('0x' + buf.toString('hex'))
  }

  toSUM (address) {
    return Web3.utils.toChecksumAddress(address)
  }

  callContract (contract, name, params) {
    return contract.methods[name](...params).call()
  }

  getContract (contract, code) {
    if (!this[contract]) {
      this[contract] = new this.client.eth.Contract(code, contract)
    }
    return this[contract]
  }

  getNonce = (address) => {
    const worker = () => {
      return this.client.eth.getTransactionCount(address)
    }
    return utils.crawlCache(address + 'nonce', this, worker, 5000)
  }

  getGasPrice = () => {
    return this.client.eth.getGasPrice()
  }

  estimateGasTxs = (transaction, options) => {
    this.client.eth.estimateGas(transaction).then(estGas => {
      const gasMultiply = get(options, 'multiply')

      return estGas < 21000 ? 21000 : (gasMultiply ? utils.Math.multiply(estGas, gasMultiply, 0) : estGas)
    }).catch(err => {
      const stringErr = err.toString()

      // For a case below min gasPrice require for running transaction
      if (stringErr.includes('max fee per gas')) {
        const splitGas = stringErr.match(/[0-9]+/g)
        const gasSuggest = splitGas[splitGas.length - 2]

        transaction.gasPrice = utils.convertDecimalToHex(utils.Math.multiply(gasSuggest, 1.05, 0))

        return this.estimateGasTxs(transaction)
      }

      // For a case some chain remove chainId from estimateGas
      if (stringErr.includes('chainId')) {
        delete transaction.chainId
        return this.estimateGasTxs(transaction)
      }
      return 0
    })
  }

  encodeMessErr (mess) {
    if (!mess) return
    const stringResult = mess.toString()

    let messageReturn

    if (stringResult.includes('insufficient funds')) {
      messageReturn = messages.MESS_001
    }

    if (stringResult.includes('replacement transaction underpriced')) {
      messageReturn = messages.MESS_002
    }

    return messageReturn
  }

  // Wallet must correct format { address, privateKey or mnemonic (not recommend) }
  async postBaseSendTxs (wallet, options) {
    if (!wallet || !get(options, 'receiver') || !get(wallet, 'privateKey')) return
    const isHardwareWallet = get(wallet, 'isHardwareWallet')
    const nonce = await this.getNonce(wallet.address)

    // Value must correct HEX format
    const {
      receiver, data = '0x', gas, gasPrice, gasMultiply,
      value = '0x0',
      callback, callbackFinal, callbackConfirmation, isWaitDone
    } = options

    const rawTransaction = {
      nonce,
      to: receiver,
      from: wallet.address,
      data: data || '0x',
      value: value || '0x0',
      gas: gas || 0,
      gasPrice: gasPrice || 0,
      chainId: this.chainId
    }

    if (!rawTransaction.gas) {
      rawTransaction.gas = await this.estimateGasTxs(rawTransaction, { multiply: gasMultiply })
    }

    if (!rawTransaction.gasPrice) {
      const gasPriceDefault = await window.wallet.getPostSocket('emitGasPrice', this.chainSetting.key)
      rawTransaction.gas = gasPriceDefault || await this.getGasPrice()
    }

    // Supported new hardfork london
    if (!isHardwareWallet && get(this.chainSetting, 'isSupportedEIP1559')) {
      const isSupportedGasFeeCap = [CHAIN_ID.avax]

      if (isSupportedGasFeeCap.includes(this.chainSetting.key)) {
        rawTransaction.gasFeeCap = rawTransaction.gasPrice
      }

      rawTransaction.maxFeePerGas = utils.convertDecimalToHex(utils.Math.multiply(rawTransaction.gasPrice, 1.2, 0))
      rawTransaction.maxPriorityFeePerGas = this.chainSetting.maxPriorityFeePerGas || '0x59682f00'

      if (utils.Math.compare(rawTransaction.maxPriorityFeePerGas, rawTransaction.maxFeePerGas) === 1) {
        rawTransaction.maxPriorityFeePerGas = rawTransaction.maxFeePerGas
      }

      // Gas price and ChainID no needed in EIP1559
      delete rawTransaction.chainId
      delete rawTransaction.gasPrice
    }

    let preTransaction

    if (isHardwareWallet) {
      // preTransaction = await window.wallet.sendHardwareWallet(this.chainSetting.key, rawTransaction)
    } else {
      preTransaction = await this.client.eth.accounts.signTransaction(rawTransaction, wallet.privateKey)
    }

    const signedTransaction = preTransaction.rawTransaction
    console.log('Transaction signed: ', rawTransaction)

    return new Promise(async (resolve, reject) => {
      let hashTxs
      const startTime = moment().unix()

      const blockTransaction = this.client.eth.sendSignedTransaction(signedTransaction, (err, hash) => {
        if (err) {
          console.log('Transaction submitted to blockchain failed: ', err)
          reject(this.encodeMessErr(err))
        } else {
          hashTxs = hash
          console.log('Transaction submitted to blockchain success: ', hash)
          callback && callback(hash)
          !isWaitDone && resolve(hash)

          window.wallet.getPostSocket('emitTxs', {
            hash,
            chain: this.chainSetting.key,
            rawTransaction
          })
        }
      })

      if (isWaitDone) {
        blockTransaction.then(receipt => {
          const endTime = moment().unix()
          resolve(hashTxs)

          callbackFinal && callbackFinal({
            time: {
              endTime,
              startTime,
              duration: endTime - startTime
            },
            hash: hashTxs
          })
        }).catch(err => {
          reject(this.encodeMessErr(err))
        })
      }

      if (callbackConfirmation) {
        blockTransaction.on('confirmation', (confirms) => {
          callbackConfirmation(hashTxs, confirms + 1)
        })
      }
    })
  }
}

export default EVMProvider
