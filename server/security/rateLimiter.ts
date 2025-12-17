import rateLimit from 'express-rate-limit'
import type { Request, Response } from 'express'

/**
 * Rate limiter para login (5 tentativas em 15 minutos)
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limit para IPs confiáveis
    const trustedIPs = process.env.TRUSTED_IPS?.split(',') || []
    return trustedIPs.includes(req.ip || '')
  },
})

/**
 * Rate limiter para API (100 requisições em 15 minutos)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Rate limiter para criação de conta (3 contas em 1 hora)
 */
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: 'Muitas contas criadas. Tente novamente em 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Rate limiter para password reset (3 tentativas em 1 hora)
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Muitas tentativas de reset de senha. Tente novamente em 1 hora.',
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Custom rate limiter com armazenamento em memória
 */
export class InMemoryRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(private maxAttempts: number = 5, private windowMs: number = 15 * 60 * 1000) {}

  isLimited(key: string): boolean {
    const now = Date.now()
    const record = this.attempts.get(key)

    if (!record) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs })
      return false
    }

    if (now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs })
      return false
    }

    record.count++
    return record.count > this.maxAttempts
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }

  getRemainingAttempts(key: string): number {
    const record = this.attempts.get(key)
    if (!record) return this.maxAttempts

    const remaining = this.maxAttempts - record.count
    return Math.max(0, remaining)
  }
}
