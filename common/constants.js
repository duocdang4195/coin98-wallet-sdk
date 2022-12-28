export const AWS_CURRENCY = (name) => `https://coin98.s3.ap-southeast-1.amazonaws.com/Currency/${name}.png`

export const PROVIDER_PATH = {
  evm: require('../provider/evm').default,
  cosmos: require('../provider/cosmos'),
  solana: require('../provider/solana/index').default
}

// Chain ID already supported in Coin98 ecosystem
// * Sorted chain is number of key in sorted object
// * isOther Flag for item not a chain. Use for some special case like testnet or hardware wallet
// * isMnemonic Flag for chain will only use mnemonic not support private key yet
// * isFee Flag for chain supported fee config
// * isToken Flag for chain supported token like ERC20 or SPL
// * isSupportedNFT Flag for chain supported NFT
// * isWeb3 Flag for chain supported Web3
// * isBridge Flag for chain supported Bridge like Spacegate
// * isCosmos Flag for chain in cosmos ecosystem
// * isMemo Flag for chain in supported memo (Memo use when CEX need to verify which user deposited)
// * isSupportedEIP1559 Flag for chain supported EIP1559 ReadMore: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md
// * trcName Define sub-name for chain
// * nftToken Define name for NFT Type
// * trcToken Define name for Token Type
// * numPath Define num last path in derivation path ReadMore: https://medium.com/mycrypto/wtf-is-a-derivation-path-c3493ca2eb52
// * denom Define denom name (Token Name) for chain in Cosmos System
// * symbolSpecial Define special name for some chain needed
// * numLoad Sort priority loading, evm is loading first and then other chains, the latest is chain like bitcoin and avaxX
// * balances Contract address for loading balance in EVM
// * multisend Contract address for multisend in EVM
// * nftMint Contract address for mint NFT in EVM
export const CHAIN_DATA = {
  multiChain: {
    isOther: true,
    isMnemonic: true,
    name: 'Multi-Chain',
    image: 'app_multi_chain',
    chain: 'multiChain',
    trcName: 'All Blockchains'
  },
  evm: {
    isOther: true,
    name: 'EVM Wallet',
    image: 'app_evm',
    chain: 'evm',
    trcName: 'EVM Wallet'
  },
  hardwareWallet: {
    isOther: true,
    isHardware: true,
    name: 'Hardware Wallet',
    image: 'app_ledger',
    chain: 'hardwareWallet',
    trcName: 'Import hardware wallet'
  },
  customCreate: {
    isOther: true,
    name: 'Custom Network',
    image: 'app_custom_network',
    chain: 'customCreate',
    trcName: 'Create Custom Network'
  },
  custom: {
    isOther: true,
    name: 'Custom Network',
    image: 'app_box',
    chain: 'custom',
    trcName: 'Custom Network'
  },
  'https://data-seed-prebsc-1-s1.binance.org:8545/': {
    kind: 'evm',
    key: 'https://data-seed-prebsc-1-s1.binance.org:8545/',

    numChainId: 97,
    decimals: 18,
    chainId: '0x61',
    numLoad: 1,
    isBridge: true,
    isToken: true,
    isSupportedNFT: true,
    nftToken: 'BEP721',
    trcToken: 'BEP20',
    symbolSpecial: 'BSC',
    balances: '0xA6762c710852681c4593C10c4304C5211FB2122c',
    multisend: '0x2E1D30460265bFEBedacf5bb6f9A80F0E74B7498',
    nftMint: '0x2418400d29F8B774E49e93C5cb54460ae5Ecd788',
    stake: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
    subName: 'BSC',

    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_binance',

    id: 'binancecoin',
    name: 'BNB Smart Chain testnet',
    shortName: 'BSC',
    symbol: 'BNB',
    chain: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    trcName: 'BNB BEP20',
    rpcURL: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    scan: 'https://testnet.bscscan.com/',
    launchpadFactory: '0x31313099814980854c55C131bDEa6736e93feE8b',
    launchpadMintableKey: '0x444f313053c893c305c4a5f333f3b033d548405c830016c4b623e787aa045145'
  },
  'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161': {
    kind: 'evm',
    key: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    numChainId: 5,
    decimals: 18,
    chainId: '0x5',
    numLoad: 1,
    isBridge: true,
    isToken: true,
    isSupportedNFT: true,
    nftToken: 'BEP721',
    trcToken: 'BEP20',
    symbolSpecial: 'ETH',
    balances: '0xA6762c710852681c4593C10c4304C5211FB2122c',
    multisend: '0x2E1D30460265bFEBedacf5bb6f9A80F0E74B7498',
    nftMint: '0x2418400d29F8B774E49e93C5cb54460ae5Ecd788',
    stake: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
    subName: 'ETH',

    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_ethereum',

    id: 'ETH',
    name: 'Görli(ETH) testnet',
    shortName: 'ETH',
    symbol: 'ETH',
    chain: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    trcName: 'BNB BEP20',
    rpcURL: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    scan: 'https://goerli.etherscan.io/',
    launchpadFactory: '0xB3E382CA0562C4440f346768b9b20bA813d21FDb',
    launchpadMintableKey: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
    launchpadTransferableKey: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9'
  },
  '5': {
    kind: 'evm',
    key: '5',

    numChainId: 5,
    decimals: 18,
    chainId: '0x5',
    numLoad: 0,
    isSupportedEIP1559: true,
    isToken: true,
    isBridge: true,
    isSupportedNFT: true,

    trcToken: 'ERC20',
    nftToken: 'ERC721',
    balances: '0x38bb7b9b87bdfbed883aaf50a2f411d330fe32d6',
    multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
    stake: '0x836bf46520C373Fdc4dc7E5A3bAe735d13bD44e3',
    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_ethereum',
    id: 'ethereum',
    name: 'Ethereum goerli',
    shortName: 'Ethereum',
    symbol: 'ETH',
    chain: '5',
    trcName: 'ETH ERC20 ERC721',
    rpcURL: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    scan: 'https://goerli.etherscan.io/',
    launchpadFactory: '0xB3E382CA0562C4440f346768b9b20bA813d21FDb',
    launchpadMintableKey: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
    launchpadTransferableKey: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9'
  },
  97: {
    kind: 'evm',
    key: '97',

    numChainId: 97,
    decimals: 18,
    chainId: '0x61',
    numLoad: 1,
    isBridge: true,
    isToken: true,
    isSupportedNFT: true,
    nftToken: 'BEP721',
    trcToken: 'BEP20',
    symbolSpecial: 'BSC',
    balances: '0xA6762c710852681c4593C10c4304C5211FB2122c',
    multisend: '0x2E1D30460265bFEBedacf5bb6f9A80F0E74B7498',
    nftMint: '0x2418400d29F8B774E49e93C5cb54460ae5Ecd788',
    stake: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
    subName: 'BSC',

    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_binance',

    id: 'binancecoin',
    name: 'BNB Smart Chain testnet',
    shortName: 'BSC',
    symbol: 'BNB',
    chain: '97',
    trcName: 'BNB BEP20',
    rpcURL: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    scan: 'https://testnet.bscscan.com/',
    launchpadFactory: '0x31313099814980854c55C131bDEa6736e93feE8b',
    launchpadMintableKey: '0x444f313053c893c305c4a5f333f3b033d548405c830016c4b623e787aa045145'
  },
  bitcoin: {
    numLoad: 5,
    isFee: true,
    isMnemonic: true,
    image: 'app_bitcoin',
    id: 'bitcoin',
    name: 'Bitcoin',
    shortName: 'Bitcoin',
    symbol: 'BTC',
    chain: 'bitcoin',
    trcName: 'BTC',
    scan: 'https://www.blockchain.com/btc'
  },
  ether: {
    kind: 'evm',
    key: 'ether',

    numChainId: 1,
    decimals: 18,
    chainId: '0x1',
    numLoad: 0,
    isSupportedEIP1559: true,
    isToken: true,
    isBridge: true,
    isSupportedNFT: true,

    trcToken: 'ERC20',
    nftToken: 'ERC721',
    balances: '0x38bb7b9b87bdfbed883aaf50a2f411d330fe32d6',
    multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
    stake: '0x836bf46520C373Fdc4dc7E5A3bAe735d13bD44e3',
    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_ethereum',
    id: 'ethereum',
    name: 'Ethereum',
    shortName: 'Ethereum',
    symbol: 'ETH',
    chain: 'ether',
    trcName: 'ETH ERC20 ERC721',
    rpcURL: 'https://mainnet.infura.io/v3/92d53cee52834368b0fabb42fa1b5570',
    scan: 'https://etherscan.io'
  },
  binanceSmart: {
    kind: 'evm',
    key: 'binanceSmart',

    numChainId: 56,
    decimals: 18,
    chainId: '0x38',
    numLoad: 1,
    isBridge: true,
    isToken: true,
    isSupportedNFT: true,
    nftToken: 'BEP721',
    trcToken: 'BEP20',
    symbolSpecial: 'BSC',
    balances: '0xA6762c710852681c4593C10c4304C5211FB2122c',
    multisend: '0x2E1D30460265bFEBedacf5bb6f9A80F0E74B7498',
    nftMint: '0xc4cAd0938256ABA4417c565044Be2c2EB77096cb',
    stake: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
    subName: 'BSC',

    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_binance',

    id: 'binancecoin',
    name: 'BNB Smart Chain',
    shortName: 'BSC',
    symbol: 'BNB',
    chain: 'binanceSmart',
    trcName: 'BNB BEP20',
    rpcURL: 'https://bscrpc.com',
    scan: 'https://bscscan.com'
  },
  heco: {
    maxPriorityFeePerGas: '0x861c4680',
    kind: 'evm',
    key: 'heco',

    numChainId: 128,
    decimals: 18,
    chainId: '0x80',
    numLoad: 1,
    isToken: true,
    isSupportedEIP1559: true,
    isSupportedNFT: true,
    trcToken: 'HRC20',
    nftToken: 'HRC721',
    isWeb3: true,
    isFee: true,
    image: 'app_heco',
    balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
    multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
    nftMint: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',

    id: 'huobi-token',
    name: 'HECO Chain',
    shortName: 'Huobi',
    symbol: 'HT',
    chain: 'heco',
    trcName: 'HT HRC20',
    rpcURL: 'https://http-mainnet.hecochain.com',
    scan: 'https://hecoinfo.com'
  },
  okex: {
    kind: 'evm',
    key: 'okex',

    numChainId: 66,
    decimals: 18,
    chainId: '0x42',
    numLoad: 2,
    isSupportedNFT: true,
    balances: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
    multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
    isToken: true,
    id: 'oec-token',
    name: 'OKXChain',
    image: 'app_okex',
    symbol: 'OKT',
    chain: 'okex',
    icon: 'okex',
    trcToken: 'KIP20',
    nftToken: 'NFT',
    trcName: 'OKT KIP10 KIP20 NFT',
    isFee: true,
    isWeb3: true,
    rpcURL: 'https://exchainrpc.okex.org',
    scan: 'https://www.oklink.com/okexchain'
  },
  terra2: {
    prefix: 'terra',
    numPath: 330,

    numLoad: 3,
    isToken: true,
    trcToken: 'CW20',

    isCosmos: true,
    isMemo: true,

    id: 'terra-luna-2',
    name: 'Terra 2.0',
    image: 'app_terra2',
    symbol: 'LUNA',
    denom: 'uluna',
    chain: 'terra2',
    trcName: 'LUNA CW20',
    scan: 'https://finder.terra.money/mainnet/',
    chainId: 'phoenix-1'
  },
  gate: {
    numChainId: 86,
    chainId: '0x56',
    numLoad: 2,
    balances: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
    multisend: '0x963e1bcd1f82724bd8fa16a3b6962d100fb287fc',
    nftMint: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',
    isSupportedNFT: true,
    isToken: true,
    id: 'gatechain-token',
    name: 'GateChain',
    image: 'app_gate',
    symbol: 'GT',
    chain: 'gate',
    icon: 'gate',
    trcToken: 'GRC20',
    nftToken: 'GRC721',
    trcName: 'GT GRC20 GRC721',
    isFee: true,
    isWeb3: true,
    rpcURL: 'https://evm.gatenode.cc',
    scan: 'https://gatescan.org'
  },

  kucoin: {
    numChainId: 321,
    chainId: '0x141',

    numLoad: 2,
    isToken: true,
    subName: 'KCS',
    trcToken: 'KRC20',
    nftToken: 'KRC721',
    balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
    multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
    nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
    isWeb3: true,
    isSupportedNFT: true,
    isFee: true,
    image: 'app_kucoin',
    id: 'kucoin-shares',
    name: 'KuCoin Community Chain',
    shortName: 'Kucoin',
    symbol: 'KCS',
    chain: 'kucoin',
    trcName: 'KCS KRC20 KRC721',
    rpcURL: 'https://rpc-mainnet.kcc.network',
    scan: 'https://explorer.kcc.io/en'
  },
  solana: {
    kind: 'solana',
    key: 'solana',
    numLoad: 1,
    isToken: true,
    trcToken: 'SPL',
    nftToken: 'SPL NFT',
    multisend: true,
    isBridge: true,
    isSupportedNFT: true,

    image: 'app_solana',

    id: 'solana',
    name: 'Solana',
    shortName: 'Solana',
    symbol: 'SOL',
    chain: 'solana',
    trcName: 'SOL SPL',
    rpcURL: 'https://coin98.genesysgo.net',
    rpcURLSerum: 'https://solana-api.projectserum.com',
    scan: 'https://solscan.io',
    launchpadProgramId: "Qm8YDspQzpZAPEusCMx9uKVnRHwfFHGvWNLq3g823Nk"
  },
  near: {
    numLoad: 2,
    isToken: true,
    trcToken: 'NEP141',

    image: 'app_near',
    id: 'near',
    name: 'Near',
    symbol: 'NEAR',
    trcName: 'NEAR NEP141',
    chain: 'near',
    scan: 'https://explorer.near.org',
    rpcURL: 'https://public-rpc.blockpi.io/http/near',
    // rpcURL: 'https://rpc.mainnet.near.org',
    scanTxs: 'transactions',
    scanAddr: 'accounts'
  },
  avax: {
    isSupportedEIP1559: true,
    numPath: 9000,

    isBridge: true,
    numChainId: 43114,
    chainId: '0xa86a',

    numLoad: 1,
    isSupportedNFT: true,
    isToken: true,
    trcToken: 'ARC20',
    nftToken: 'ARC721',
    symbolSpecial: 'CCHAIN',
    balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
    multisend: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
    nftMint: '0x0eCE57A677D5e72D1ad45774239e23463CF1d743',

    subName: 'C',

    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_avalancher',
    id: 'avalanche-2',
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    symbol: 'AVAX',
    chain: 'avax',
    trcName: 'AVAX-C ARC20',
    rpcURL: 'https://api.avax.network/ext/bc/C/rpc',
    scan: 'https://snowtrace.io'
  },
  avaxX: {
    numLoad: 5,
    isBridge: true,
    symbolSpecial: 'XCHAIN',
    subName: 'X',
    image: 'app_avalancher',
    id: 'avalanche-2',
    name: 'Avalanche X-Chain',
    shortName: 'Avalanche',
    symbol: 'AVAX',
    chain: 'avaxX',
    trcName: 'AVAX-X',
    scan: 'https://avascan.info/blockchain/x'
  },
  tron: {
    numLoad: 1,
    isToken: true,
    isBridge: true,
    trcToken: 'TRC20',
    trcSubName: 'TRC10',

    image: 'app_tron',

    id: 'tron',
    name: 'Tron',
    shortName: 'Tron',
    symbol: 'TRX',
    chain: 'tron',
    trcName: 'TRX TRC10 TRC20',
    scan: 'https://tronscan.org/#',
    scanTxs: 'transaction'
  },
  matic: {
    kind: 'evm',
    key: 'matic',
    numChainId: 137,
    chainId: '0x89',
    numLoad: 2,
    isToken: true,
    trcToken: 'PRC20',
    nftToken: 'PRC721',
    isSupportedV2: true,
    isSupportedNFT: true,
    isFee: true,
    isWeb3: true,
    balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
    multisend: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',
    nftMint: '0x9aE5c1cf82aF51CBB83D9A7B1C52aF4B48E0Bb5E',

    id: 'matic-network',
    name: 'Polygon',
    image: 'app_polygon',
    symbol: 'MATIC',
    chain: 'matic',
    trcName: 'MATIC PRC20',
    rpcURL: 'https://rpc-mainnet.maticvigil.com',
    scan: 'https://polygonscan.com',
    socketRPC: "wss://muddy-radial-snowflake.matic.discover.quiknode.pro/d4092cccf1b6b45bb39dc82c4afd241ebeb26d45/"
  },
  fantom: {
    numChainId: 250,
    chainId: '0xFA',

    numLoad: 2,
    isSupportedV2: true,
    isToken: true,
    isSupportedNFT: true,
    trcToken: 'FRC20',
    nftToken: 'FRC721',
    balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
    multisend: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
    nftMint: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',

    isFee: true,
    isWeb3: true,

    id: 'fantom',
    name: 'Fantom',
    image: 'app_fantom',
    symbol: 'FTM',
    chain: 'fantom',
    trcName: 'FANTOM FRC20',
    rpcURL: 'https://rpcapi.fantom.network',
    scan: 'https://ftmscan.com'
  },
  xDai: {
    isSupportedEIP1559: true,
    numChainId: 100,
    chainId: '0x64',

    numLoad: 2,
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
    nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
    isSupportedNFT: true,
    isToken: true,
    id: 'xdai',
    name: 'Gnosis Chain',
    image: 'app_xDai',
    symbol: 'XDAI',
    chain: 'xDai',
    icon: 'xDai',
    trcToken: 'XRC20',
    nftToken: 'XRC721',
    trcName: 'XDAI XRC20',
    isFee: true,
    isWeb3: true,
    rpcURL: 'https://rpc.xdaichain.com',
    scan: 'https://blockscout.com/xdai/mainnet'
  },
  polkadot: {
    isPolkadot: true,
    numLoad: 3,
    image: 'app_polkadot',

    isMnemonic: true,
    id: 'polkadot',
    name: 'Polkadot',
    shortName: 'Polkadot',
    symbol: 'DOT',
    chain: 'polkadot',
    trcName: 'DOT',
    rpcURL: 'rpc.polkadot.io',
    scan: 'https://polkadot.subscan.io',
    scanTxs: 'extrinsic',
    scanAddr: 'account'
  },
  kusama: {
    isPolkadot: true,
    numLoad: 3,
    image: 'app_kusama',

    isMnemonic: true,
    id: 'kusama',
    name: 'Kusama',
    shortName: 'Kusama',
    symbol: 'KSM',
    chain: 'kusama',
    trcName: 'KSM',
    rpcURL: 'kusama-rpc.polkadot.io',
    scan: 'https://kusama.subscan.io'
  },
  cosmos: {
    prefix: 'cosmos',
    numPath: 118,

    numLoad: 3,
    isCosmos: true,
    isMemo: true,
    isFactory: true,

    chainId: 'cosmoshub-4',
    id: 'cosmos',
    name: 'Cosmos',
    image: 'app_cosmos',
    symbol: 'ATOM',
    chain: 'cosmos',
    trcName: 'ATOM',
    scan: 'https://www.mintscan.io/cosmos',
    scanTxs: 'txs',
    scanAddr: 'account',
    scanBlocks: 'blocks/id'
  },
  thor: {
    prefix: 'thor',
    numPath: 931,

    numLoad: 3,
    isCosmos: true,
    isMemo: true,
    id: 'thorchain',
    name: 'THORChain',
    image: 'app_thorchain',
    symbol: 'RUNE',
    chain: 'thor',
    trcName: 'RUNE',
    scan: 'https://viewblock.io/thorchain'
  },

  terra: {
    prefix: 'terra',
    numPath: 330,

    numLoad: 3,
    isToken: true,
    trcToken: 'CW20',

    isCosmos: true,
    isMemo: true,

    id: 'terra-luna',
    name: 'Old Terra',
    image: 'app_terra',
    symbol: 'LUNC',
    denom: 'uluna',
    chain: 'terra',
    trcName: 'LUNC CW20',
    scan: 'https://finder.terra.money/columbus-5',
    chainId: 'columbus-5'
  },
  band: {
    prefix: 'band',
    numPath: 494,

    numLoad: 3,
    isCosmos: true,
    isMemo: true,
    id: 'band-protocol',
    name: 'BandChain',
    image: 'app_band',
    symbol: 'BAND',
    trcName: 'BAND',
    chain: 'band',
    scan: 'https://cosmoscan.io',
    scanAddr: 'account'
  },
  kava: {
    prefix: 'kava',
    numPath: 459,

    numLoad: 3,
    isCosmos: true,
    isMemo: true,

    id: 'kava',
    name: 'Kava',
    image: 'app_kava',
    symbol: 'KAVA',
    chain: 'kava',
    trcName: 'KAVA',
    scan: 'https://www.mintscan.io/kava',
    scanTxs: 'txs',
    scanAddr: 'account',
    scanBlocks: 'blocks/id'
  },
  secretNetwork: {
    prefix: 'secret',
    numPath: 529,

    numLoad: 3,
    isCosmos: true,
    isMemo: true,
    isFactory: true,

    chainId: 'secret-4',
    id: 'secret',
    name: 'Secret Network',
    image: 'app_secret_network',
    symbol: 'SCRT',
    chain: 'secretNetwork',
    trcName: 'SCRT',
    scan: 'https://secretnodes.com/secret/chains/secret-4',
    scanTxs: 'transactions',
    scanAddr: 'account',
    scanBlocks: 'blocks/id'
  },
  persistence: {
    prefix: 'persistence',
    numPath: 750,

    numLoad: 3,
    isCosmos: true,
    isMemo: true,
    isFactory: true,

    chainId: 'core-1',
    id: 'persistence',
    name: 'Persistence',
    image: 'app_-persistence',
    symbol: 'XPRT',
    chain: 'persistence',
    trcName: 'XPRT',
    scan: 'https://explorer.persistence.one',
    scanBlocks: 'blocks',
    scanTxs: 'transactions',
    scanAddr: 'wallet'
  },

  binance: {
    prefix: 'bnb',
    numPath: 714,

    numLoad: 2,
    isToken: true,
    trcToken: 'BEP2',
    symbolSpecial: 'BC',

    isCosmos: true,
    isMemo: true,
    subName: 'BC',

    image: 'app_binance',

    id: 'binancecoin',
    name: 'BNB Beacon Chain',
    shortName: 'Binance',
    symbol: 'BNB',
    chain: 'binance',
    trcName: 'BNB BEP2 BEP8',
    scan: 'https://explorer.binance.org'
  },
  functionX: {
    prefix: 'fx',
    numPath: 118,

    numLoad: 3,
    isCosmos: true,
    isFactory: true,
    isMemo: true,

    chainId: 'fxcore',
    id: 'fx-coin',
    name: 'Function X',
    image: 'app_functionX',
    symbol: 'FX',
    chain: 'functionX',
    trcName: 'FX FXRC20',
    scan: 'https://explorer.functionx.io/fxcore',
    rpcURL: 'https://fx-json.functionx.io:26657',
    scanTxs: 'tx',
    scanAddr: 'address'
  },
  elrond: {
    isLibrary: true,

    prefix: 'erd',
    numPath: 508,
    nftToken: 'SFT',
    numLoad: 3,
    feeDefault: 0.00005,
    isToken: true,
    trcToken: 'ESDT',

    id: 'elrond-erd-2',
    name: 'Elrond',
    image: 'app_elrond',
    symbol: 'EGLD',
    chain: 'elrond',
    trcName: 'EGLD ESDT SFT',
    scan: 'https://explorer.elrond.com',
    scanTxs: 'transactions',
    scanAddr: 'accounts',
    scanBlocks: 'blocks'
  },
  tezos: {
    isLibrary: true,
    feeDefault: 0.0015,

    prefix: 'tz1',
    numPath: 1729,
    nftToken: 'FA2',
    isToken: true,
    trcToken: 'FA1.2',
    numLoad: 2,

    id: 'tezos',
    name: 'Tezos',
    image: 'app_tezos',
    symbol: 'XTZ',
    rpcURL: 'https://mainnet.api.tez.ie',
    chain: 'tezos',
    trcName: 'XTZ FA1.2 FA2',
    scan: 'https://tezblock.io',
    scanTxs: 'transaction',
    scanAddr: 'account',
    scanBlocks: 'block'
  },
  celo: {
    // mainAddress: '0x471ece3750da237f93b8e339c536989b8978a438',
    numPath: 52752,

    numChainId: 42220,
    chainId: '0xA4EC',

    numLoad: 1,
    isSupportedNFT: true,
    isFee: true,
    isToken: true,
    balances: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
    multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
    isWeb3: true,
    nftToken: 'CELO721',
    image: 'app_celo',
    id: 'celo',
    name: 'Celo',
    shortName: 'Celo',
    symbol: 'CELO',
    chain: 'celo',
    trcName: 'CELO CUSD',
    rpcURL: 'https://forno.celo.org',
    scan: 'https://explorer.celo.org'
  },
  tomo: {
    numPath: 889,

    numChainId: 88,
    chainId: '0x58',
    // numChainId: 4,
    // chainId: '0x4',

    numLoad: 2,
    isBridge: true,
    isToken: true,
    isSupportedNFT: true,
    trcToken: 'TRC21',
    nftToken: 'TRC721',
    isWeb3: true,
    isFee: true,
    image: 'app_tomochain',
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    // multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
    nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',

    id: 'tomochain',
    name: 'TomoChain',
    shortName: 'Tomo',
    symbol: 'TOMO',
    chain: 'tomo',
    trcName: 'TOMO TRC21',
    rpcURL: 'https://rpc.tomochain.com',
    scan: 'https://scan.tomochain.com'
  },
  algorand: {
    trcToken: 'ALGO',
    nftToken: 'ALGO721',
    isToken: true,
    id: 'algorand',
    name: 'Algorand',
    image: 'app_algorand',
    symbol: 'ALGO',
    chain: 'algorand',
    trcName: 'ALGO ALGO721',
    scan: 'https://algoexplorer.io'
  },
  casper: {
    trcToken: 'CSPR',
    nftToken: 'CSPR-NFT',
    id: 'casper-network',
    name: 'Casper',
    image: 'app_casper',
    symbol: 'CSPR',
    chain: 'casper',
    trcName: 'CSPR',
    scanTxs: 'deploy',
    scanAddr: 'account',
    scan: 'https://cspr.live'
  },
  kardia: {
    numChainId: 24,
    chainId: '0x18',

    numLoad: 2,
    isToken: true,
    id: 'kardiachain',
    name: 'KardiaChain',
    image: 'app_kardia',
    symbol: 'KAI',
    chain: 'kardia',
    icon: 'kardia',
    subName: 'KAI',
    trcToken: 'KRC20',
    nftToken: 'KRC721',
    trcName: 'KAI KRC20 KRC721',
    balances: '0x8ef3C4Bf105Ec17cbeD7615C5711d2F4D44a4194',
    multisend: '0xf21201135568A81c9046d60a003eC2B883173F2f',
    nftMint: '0x8347CD0aaF874259e9d577BeE08231F648C3fc29',

    isFee: true,
    isWeb3: true,
    rpcURL: 'https://rpc.kardiachain.io',
    scan: 'https://explorer.kardiachain.io'
  },
  ronin: {
    prefix: 'ronin:',
    numChainId: 2020,
    chainId: '0x7e4',

    numLoad: 2,
    isToken: true,
    isSupportedNFT: true,
    id: 'ronin',
    name: 'Ronin',
    image: 'app_ronin',
    nftToken: 'RRC721',
    symbol: 'RON',
    chain: 'ronin',
    icon: 'ronin',
    trcToken: 'RRC20',
    trcName: 'RON RRC20 RRC721',
    isFee: true,
    isWeb3: true,
    rpcURL: 'https://api.roninchain.com/rpc',
    scan: 'https://explorer.roninchain.com'
  },

  klaytn: {
    numChainId: 8217,
    chainId: '0x2019',

    numLoad: 2,
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multisend: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',

    isSupportedNFT: true,
    isToken: true,
    id: 'klay-token',
    name: 'Klaytn',
    image: 'app_klaytn',
    symbol: 'KLAY',
    trcToken: 'KIP7',
    nftToken: 'KIP37',

    chain: 'klaytn',
    icon: 'klaytn',
    trcName: 'KLAY KIP7 KIP37',
    isFee: true,
    isWeb3: true,
    scan: 'https://scope.klaytn.com',
    rpcURL: 'https://kaikas.cypress.klaytn.net:8651',
    scanAddr: 'account'
  },
  harmony: {
    prefix: 'one',
    numChainId: 1666600000,
    chainId: '0x63564C40',
    numLoad: 1,
    isToken: true,
    isSupportedNFT: true,
    nftToken: 'HRC721',
    trcToken: 'HRC20',
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multisend: '0x9aE5c1cf82aF51CBB83D9A7B1C52aF4B48E0Bb5E',
    nftMint: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',

    isWeb3: true,
    isFee: true,
    image: 'app_harmony',

    id: 'harmony',
    name: 'Harmony',
    symbol: 'ONE',
    chain: 'harmony',
    trcName: 'ONE HRC20 HRC721',
    rpcURL: 'https://api.harmony.one',
    scan: 'https://explorer.harmony.one'
  },
  conflux: {
    isLibrary: true,
    feeDefault: 0.00005,

    prefix: 'cfx',
    trcToken: 'CRC20',
    nftToken: 'CRC721',
    isToken: true,
    numLoad: 2,

    id: 'conflux-token',
    name: 'Conflux',
    image: 'app_conflux',
    symbol: 'CFX',
    chain: 'conflux',
    trcName: 'CFX CRC20 CRC721',
    scan: 'https://www.confluxscan.io',
    scanTxs: 'transaction',
    scanAddr: 'address',
    scanBlocks: 'block'
  },
  optimism: {
    // defaultGas: 882000,
    // mainAddress: '0x4200000000000000000000000000000000000006',
    isL2: true,
    isBridge: true,
    numChainId: 10,
    chainId: '0xA',
    // numChainId: 69,
    // chainId: '0x45',

    numLoad: 2,
    isToken: true,
    trcToken: 'ERC20 OPT',
    nftToken: 'ERC721 OPT',
    // balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    // multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
    isWeb3: true,
    isFee: true,
    image: 'app_optimism',
    id: 'ethereum',
    name: 'Optimism',
    shortName: 'Optimism',
    symbol: 'ETH',
    symbolSpecial: 'OP',
    chain: 'optimism',
    trcName: 'ETH ERC20 ERC721',
    rpcURL: 'https://mainnet.optimism.io',
    // rpcURL: 'https://kovan.optimism.io',
    scan: 'https://optimistic.etherscan.io'
  },
  boba: {
    // defaultGas: 80000000,
    // mainAddress: '0x4200000000000000000000000000000000000006',
    isL2: true,
    isBridge: true,
    numChainId: 288,
    chainId: '0x120',
    // numChainId: 28,
    // chainId: '0x1C',

    numLoad: 2,
    isToken: true,
    trcToken: 'ERC20 BOBA',
    nftToken: 'ERC721 BOBA',
    // multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
    isWeb3: true,
    isFee: true,
    image: 'app_boba',
    id: 'ethereum',
    name: 'Boba Network',
    shortName: 'Boba Network',
    symbol: 'ETH',
    symbolSpecial: 'BOBA',
    chain: 'boba',
    trcName: 'ETH ERC20 ERC721',
    rpcURL: 'https://mainnet.boba.network',
    scan: 'https://blockexplorer.boba.network'
  },
  arbitrum: {
    // defaultGas: 7000000,
    isL2: true,
    isBridge: true,
    numChainId: 42161,
    chainId: '0xA4B1',
    // numChainId: 421611,
    // chainId: '0x66EEB',

    numLoad: 2,
    isToken: true,
    trcToken: 'ERC20 ARB',
    nftToken: 'ERC721 ARB',
    // balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    isWeb3: true,
    isFee: true,
    image: 'app_arbitrum',
    id: 'ethereum',
    name: 'Arbitrum',
    shortName: 'Arbitrum',
    symbol: 'ETH',
    symbolSpecial: 'ARB',
    chain: 'arbitrum',
    trcName: 'ETH ERC20 ERC721',
    rpcURL: 'https://arb1.arbitrum.io/rpc',
    // rpcURL: 'https://rinkeby.arbitrum.io/rpc',
    scan: 'https://arbiscan.io'
  },
  arbitrumXdai: {
    isL2: true,
    numChainId: 200,
    chainId: '0xC8',

    numLoad: 2,
    isToken: true,
    isSupportedNFT: true,
    trcToken: 'ERC20 AOX',
    nftToken: 'ERC721 AOX',
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
    nftMint: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',

    isWeb3: true,
    isFee: true,
    image: 'app_arbitrum_xdai',
    id: 'xdai',
    name: 'Arbitrum on xDai',
    shortName: 'Arbitrum on xDai',
    symbol: 'XDAI',
    symbolSpecial: 'AOX',
    chain: 'arbitrumXdai',
    trcName: 'XDAI XRC20 XRC721',
    rpcURL: 'https://arbitrum.xdaichain.com',
    scan: 'https://blockscout.com/xdai/aox'
  },
  aurora: {
    isL2: true,
    feeDefault: 0,

    numChainId: 1313161554,
    chainId: '0x4e454152',
    numLoad: 2,
    isToken: true,
    isSupportedNFT: true,
    nftToken: 'AURORA721',
    trcToken: 'AURORA20',
    // balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    // nftMint: '0xc4cAd0938256ABA4417c565044Be2c2EB77096cb',

    isWeb3: true,
    image: 'app_aurora',

    id: 'aurora-near',
    name: 'Aurora',
    shortName: 'Aurora',
    symbol: 'AURORA',
    chain: 'aurora',
    trcName: 'AURORA AURORA20 AURORA721',
    rpcURL: 'https://mainnet.aurora.dev',
    scan: 'https://explorer.mainnet.aurora.dev'
  },
  ton: {
    id: 'the-open-network',
    name: 'The Open Network',
    shortName: 'TON',
    isToken: false,
    isMemo: true,
    symbol: 'TON',
    chain: 'ton',
    trcName: 'TON TON721',
    rpcURL: 'https://toncenter.com/api/v2/jsonRPC',
    scan: 'https://tonscan.org',
    image: 'app_ton'
  },
  cronos: {
    id: 'crypto-com-chain',
    chain: 'cronos',
    name: 'Cronos',
    shortName: 'CRO',
    isToken: true,
    trcToken: 'CRO',
    numChainId: 25,
    chainId: '0x19',
    symbol: 'CRO',
    image: 'app_cronos',
    trcName: 'CRC20 CRC721',
    rpcURL: 'https://evm-cronos.crypto.org',
    scan: 'https://cronoscan.com',
    isSupportedEIP1559: true,
    isSupportedNFT: true,
    isWeb3: true,
    isFee: true,
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    nftMint: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
    multisend: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC'
  },
  bittorrent: {
    numChainId: 199,
    chainId: '0xc7',
    isToken: true,
    trcToken: 'BTT',
    isSupportedNFT: true,
    isWeb3: true,
    isFee: true,
    id: 'bittorrent',
    name: 'BitTorrent Chain',
    shortName: 'BTT',
    image: 'app_bitorrent',
    symbol: 'BTT',
    chain: 'bittorrent',
    trcName: 'BTT BRC20 BRC721',
    balances: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
    nftMint: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9',
    multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    rpcURL: 'https://rpc.bt.io',
    scan: 'https://scan.bt.io/#',
    scanTxs: 'transaction',
    scanAddr: 'address'
  },
  theta: {
    trcToken: 'THETA',
    id: 'theta-token',
    name: 'Theta Network',
    shortName: 'THETA',
    image: 'app_thetanetwork',
    symbol: 'THETA',
    chain: 'theta',
    trcName: 'TNT20 TNT721',
    rpcURL: 'https://theta-bridge-rpc.thetatoken.org/rpc',
    scan: 'https://explorer.thetatoken.org',
    scanTxs: 'txs',
    scanAddr: 'account'
    // isFee: true
  },
  thetaFuel: {
    numChainId: 361,
    chainId: '0x169',
    isToken: true,
    trcToken: 'TFUEL',
    isSupportedNFT: true,
    isWeb3: true,
    isFee: true,
    id: 'theta-fuel',
    name: 'Theta Network EVM',
    shortName: 'THETA',
    image: 'app_thetanetwork',
    symbol: 'TFUEL',
    chain: 'thetaFuel',
    trcName: 'TNT20 TNT721',
    rpcURL: 'https://eth-rpc-api.thetatoken.org/rpc',
    scan: 'https://explorer.thetatoken.org',
    scanTxs: 'txs',
    scanAddr: 'account',
    balances: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
    nftMint: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9',
    multisend: '0xf7eee3a8363731c611a24cddfcbcade9c153cfe8'
  },
  platon: {
    numChainId: 210425,
    chainId: '0x335F9',
    isToken: true,
    isWeb3: true,
    isFee: true,
    isSupportedNFT: true,
    trcToken: 'LAT',
    id: 'platon-network',
    name: 'PlatON Network',
    shortName: 'LAT',
    image: 'app_platon',
    symbol: 'LAT',
    chain: 'platon',

    trcName: 'PRC20 PRC721',
    rpcURL: 'https://openapi2.platon.network/rpc',
    scan: 'https://scan.platon.network',
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    nftMint: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
    multisend: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC'
  },
  moonbeam: {
    numChainId: 1284,
    chainId: '0x504',
    isToken: true,
    trcToken: 'GLMR',
    isSupportedEIP1559: true,
    isSupportedNFT: true,
    isWeb3: true,
    isFee: true,
    id: 'moonbeam',
    name: 'Moonbeam',
    shortName: 'GLMR',
    image: 'app_moonbeam',
    symbol: 'GLMR',
    chain: 'moonbeam',
    trcName: 'MERC20 MERC721',
    rpcURL: 'https://rpc.api.moonbeam.network',
    scan: 'https://moonscan.io',
    balances: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
    nftMint: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9',
    multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8'
  }
}

export const CHAIN_LIST = Object.keys(CHAIN_DATA)

export const CHAIN_ID = Object.keys(CHAIN_DATA).reduce((a, v) => ({ ...a, [v]: v }), {})

export const CHAIN_DATA_VALUES = Object.values(CHAIN_DATA)
export const REAL_CHAIN = CHAIN_DATA_VALUES.filter(itm => !itm.isOther)
export const PRIORITY_SORT = REAL_CHAIN.map(itm => itm.chain)
export const SETTING_LOCAL = CHAIN_DATA_VALUES.filter(itm => itm.rpcURL).reduce((a, v) => ({ ...a, [v.chain]: v.rpcURL }), {})
