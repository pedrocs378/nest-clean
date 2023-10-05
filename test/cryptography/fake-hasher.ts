import { HashComparer } from '@/domain/forum/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(plainText: string, hash: string): Promise<boolean> {
    return plainText.concat('-hashed') === hash
  }

  async hash(plainText: string): Promise<string> {
    return plainText.concat('-hashed')
  }
}
