import { describe, it, expect } from 'vitest'
import { InMemoryRateLimiter } from '../rateLimiter'

describe('InMemoryRateLimiter', () => {
  it('should allow requests within limit', () => {
    const limiter = new InMemoryRateLimiter(5, 60000)

    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(false)
  })

  it('should block requests exceeding limit', () => {
    const limiter = new InMemoryRateLimiter(3, 60000)

    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(true) // 4ª tentativa bloqueada
  })

  it('should track different users separately', () => {
    const limiter = new InMemoryRateLimiter(2, 60000)

    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(true)

    expect(limiter.isLimited('user2')).toBe(false)
    expect(limiter.isLimited('user2')).toBe(false)
    expect(limiter.isLimited('user2')).toBe(true)
  })

  it('should reset after window expires', async () => {
    const limiter = new InMemoryRateLimiter(2, 100) // 100ms window

    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(true)

    // Aguardar window expirar
    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(limiter.isLimited('user1')).toBe(false) // Deve resetar
  })

  it('should reset specific user', () => {
    const limiter = new InMemoryRateLimiter(2, 60000)

    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(false)
    expect(limiter.isLimited('user1')).toBe(true)

    limiter.reset('user1')

    expect(limiter.isLimited('user1')).toBe(false)
  })

  it('should return remaining attempts', () => {
    const limiter = new InMemoryRateLimiter(5, 60000)

    expect(limiter.getRemainingAttempts('user1')).toBe(5)
    limiter.isLimited('user1')
    expect(limiter.getRemainingAttempts('user1')).toBe(4)
    limiter.isLimited('user1')
    expect(limiter.getRemainingAttempts('user1')).toBe(3)
  })
})
