import { describe, it, expect } from 'vitest'
import {
  generateTOTPSecret,
  verifyTOTPToken,
  generateBackupCodes,
  validateBackupCode,
} from '../totp'

describe('TOTP Security', () => {
  it('should generate TOTP secret', () => {
    const { secret, qrCode } = generateTOTPSecret('user@example.com')

    expect(secret).toBeDefined()
    expect(secret.length).toBeGreaterThan(0)
    expect(qrCode).toBeDefined()
  })

  it('should generate valid backup codes', () => {
    const codes = generateBackupCodes(10)

    expect(codes).toHaveLength(10)
    codes.forEach((code) => {
      expect(code).toHaveLength(8)
      expect(code).toMatch(/^[A-Z0-9]+$/)
    })
  })

  it('should validate backup code', () => {
    const codes = generateBackupCodes(5)
    const testCode = codes[0]

    expect(validateBackupCode(testCode, codes)).toBe(true)
    expect(validateBackupCode('INVALID', codes)).toBe(false)
  })

  it('should validate backup code case-insensitively', () => {
    const codes = generateBackupCodes(5)
    const testCode = codes[0]

    expect(validateBackupCode(testCode.toLowerCase(), codes)).toBe(true)
  })

  it('should handle invalid TOTP token', () => {
    const secret = 'JBSWY3DPEBLW64TMMQ======'
    const invalidToken = '000000'

    // Token inválido deve retornar false
    const result = verifyTOTPToken(secret, invalidToken)
    expect(result).toBe(false)
  })
})
