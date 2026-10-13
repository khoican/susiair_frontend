import { describe, expect, it } from 'vitest'
import { extractApiMessage } from '../../utils/api'

describe('extractApiMessage', () => {
  it('returns string message as-is', () => {
    expect(extractApiMessage({ message: 'Invalid username or password' })).toBe(
      'Invalid username or password'
    )
  })

  it('joins array message with comma', () => {
    expect(
      extractApiMessage({ message: ['password should not be empty', 'password must be a string'] })
    ).toBe('password should not be empty, password must be a string')
  })

  it('ignores non-string array entries', () => {
    expect(extractApiMessage({ message: ['ok', 42 as unknown as string] })).toBe('ok')
  })

  it('returns null for blank string message', () => {
    expect(extractApiMessage({ message: '   ' })).toBeNull()
    expect(extractApiMessage({ message: '' })).toBeNull()
  })

  it('returns null for empty array message', () => {
    expect(extractApiMessage({ message: [] })).toBeNull()
  })

  it('returns null for missing message or non-object body', () => {
    expect(extractApiMessage({ statusCode: 404 })).toBeNull()
    expect(extractApiMessage(null)).toBeNull()
    expect(extractApiMessage('plain 404')).toBeNull()
    expect(extractApiMessage(undefined)).toBeNull()
  })
})
