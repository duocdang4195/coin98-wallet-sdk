import { SHA256 } from 'crypto-js'
import create from 'keccak'


export class HashService {
  static sha256 (message) {
    return Buffer.from(SHA256(message).toString(), 'hex')
  }

  static keckka256(input) {
    return create('keccak256').update(input).digest()
  }
}
