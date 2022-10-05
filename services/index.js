import utils from '../common/utils'
import Connector from '../system/connector'
import useSocket from './socket'
import useSupport from './support'
import { CHAIN_DATA } from '../common/constants'
import dayjs from 'dayjs'

class WalletServices {
  constructor () {
    this.connector = new Connector()
    this.support = useSupport()
    this.socket = useSocket()
    this.socket.activeSocket()
    this.fetchTokenList()
  }

  async fetchTokenList () {
    if (this.tokenList) return
    this.tokenList = await this.support.getTokenList()
  }

  async balanceOfWallet (wallet, options) {
    await this.fetchTokenList()
    if (!get(wallet, 'address')) return

    const firstLoad = dayjs().unix()
    clog('Start load balance ', firstLoad)

    const worker = async () => {
      const chain = wallet.chain
      const rawBalance = await this.balance(wallet.chain, wallet.address)
      const tokenByChain = await this.getTokenList(wallet.chain)
      const tokenData = await this.balanceOfMultipleAddress(wallet.chain, wallet.address, tokenByChain)
      tokenData.push({
        info: this.findMainToken(chain),
        chain: wallet.chain,
        rawBalance,
        walletAddress: wallet.address,
        address: ''
      })
      clog('Load EVM done for address ' + wallet.address, dayjs().unix() - firstLoad)
      return tokenData
    }

    const keyCache = wallet.address + wallet.chain + 'balanceOfWallet'
    return utils.crawlCache(keyCache, this, worker, get(options, 'isLatest') ? 0 : 0)
  }

  // Get full list coin98 token list
  getTokenList (chain) {
    if (!this.tokenList) return true
    return chain ? this.tokenList[chain] : this.tokenList
  }

  findMainToken (chain) {
    const client = this.connector.getClient(chain)
    return client.getMainToken()
  }

  getPostSocket (type, params) {
    return this.socket[type](params)
  }

  // Find token by address and chain with local token list
  // * address The address of token
  // * chain Supported chain in coin98 token list
  findToken (address, chain) {
    if (!chain || !address) return
    required(address, 0)
    const tokenByChain = this.getTokenList(chain)
    if (!tokenByChain) return
    const fmtAddress = address.toLowerCase()
    return tokenByChain.find(tk => tk.address.toLowerCase() === fmtAddress)
  }

  findTokenMarket (id) {
    return this.socket.emitCoinMarket(id)
  }

  // Validate address with rule regex and from library
  isAddress (chain, address) {
    const client = this.connector.getClient(chain)
    return client.isAddress(address)
  }

  // Every 10 second will reload again. If you want to reload now pass options isLatest to true
  // Load balance for a given address
  // Options with decimals, isRaw, isLatest
  // If possible cgkId
  // Same return format with { previousBalance, balance, lastFetch }
  balance (chain, address, options) {
    const client = this.connector.getClient(chain)
    // For a case mismatch call wrong function
    // Only for this function not for balanceOf
    return size(get(options, 'contract.address')) > 0
      ? client.balanceOf(address, options)
      : client.balance(address, options)
  }

  // Every 10 second will reload again. If you want to reload now pass options isLatest to true
  // Load balance for a token (ERC20, BEP20, Denom, SPL .....)
  // Options with contract { decimals,address }, isRaw, isLatest
  // If possible cgkId, splAddress
  // Same return format with { previousBalance, balance, lastFetch }
  balanceOf (chain, address, options) {
    const client = this.connector.getClient(chain)
    return client.balanceOf(address, options)
  }

  // Load balance for a list of token (ERC20, BEP20, Denom, SPL .....)
  balanceOfMultipleAddress (chain, address, tokenList, options) {
    const client = this.connector.getClient(chain)
    return client.balanceOfMultipleAddress(address, tokenList, options)
  }

  transfer (chain, address, options) {
    const client = this.connector.getClient(chain)
    return client.transfer(address, options)
  }

  getLinkScanExplorer = (hash, chain, options) => {
    const isOpenTxs = get(options, 'isTxs')
    const link = get(options, 'link')
    const prefix = get(options, 'prefix')

    const prefixLink = link ? (isOpenTxs ? 'tx/' : 'address/') : (isOpenTxs ? 'linkScanTxs' : 'linkAddress')

    let finalLink
    if (link) {
      let finalScan = link
      const isPrefix = link[size(link) - 1] === '/'
      if (!isPrefix) {
        finalScan = finalScan + '/'
      }
      finalLink = finalScan + (prefix || prefixLink) + hash
    } else {
      const chainData = CHAIN_DATA[chain]
      if (!chainData) return
      const sizeHash = size(hash)

      const { scan: link, scanTxs = 'tx', scanAddr = 'address', scanBlocks = 'block' } = chainData

      const isBlock = !isOpenTxs && (!hash.includes('near') && sizeHash <= 9)
      const isHex = hash.startsWith('0x')
      let isTxs = isOpenTxs === undefined ? (isHex ? sizeHash > 42 : sizeHash > 50) : isOpenTxs

      if (!isBlock) {
        // AvaxX
        if (hash.includes('X-avax')) {
          isTxs = false
        }
        // Near
        if ((link.includes('.near') && sizeHash >= 65)) {
          isTxs = isOpenTxs || (!(hash.includes('.near') || sizeHash >= 65))
        }
        // DOT || KSM
        if (hash.includes('-') && !hash.includes('X-avax')) {
          isTxs = true
        }
      }

      finalLink = `${link}/${isBlock ? scanBlocks : (isTxs ? scanTxs : scanAddr)}/${hash}`
    }

    return finalLink
  }
}

export default WalletServices
