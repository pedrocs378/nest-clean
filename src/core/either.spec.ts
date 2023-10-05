import { Either, failure, success } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return success(10)
  } else {
    return failure('error')
  }
}

describe('Either', () => {
  it('sohuld be a success', () => {
    const result = doSomething(true)

    expect(result.isSuccess()).toBe(true)
    expect(result.isFailure()).toBe(false)
  })

  it('sohuld be a failure', () => {
    const result = doSomething(false)

    expect(result.isFailure()).toEqual(true)
    expect(result.isSuccess()).toEqual(false)
  })
})
