import { PublicKey } from '@solana/web3.js'

export const ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
)

export const NATIVE_SOL = {
  symbol: 'SOL',
  name: 'Solana',
  mintAddress: 'So11111111111111111111111111111111111111112',
  decimals: 9,
  id: 'solana'
}
