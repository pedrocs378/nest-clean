import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcryptjs'

import { HashGenerator } from '@/domain/forum/cryptography/hash-generator'
import { HashComparer } from '@/domain/forum/cryptography/hash-comparer'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  compare(plainText: string, hash: string) {
    return compare(plainText, hash)
  }

  hash(plainText: string) {
    return hash(plainText, 10)
  }
}
